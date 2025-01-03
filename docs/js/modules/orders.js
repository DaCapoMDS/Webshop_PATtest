import { GITHUB_CONFIG, API_ENDPOINTS, ORDER_STATUS, ERROR_MESSAGES } from './constants.js';

export class OrderManager {
    constructor() {
        // Store only current order in localStorage for customer reference
        this.currentOrder = null;

        // Constants for retry logic
        this.MAX_RETRIES = 3;
        this.RETRY_DELAY = 2000; // 2 seconds
    }

    async checkGitHubConnection() {
        try {
            console.log('Checking order system connection...');
            
            // Try new orders endpoint first
            try {
                const response = await fetch(API_ENDPOINTS.ORDERS_API, {
                    method: 'HEAD'
                });

                if (response.ok) {
                    console.log('Order system check successful (new endpoint)');
                    return {
                        success: true,
                        message: 'Order system is ready'
                    };
                }
            } catch (error) {
                console.log('New endpoint check failed, trying legacy endpoint...');
            }

            // Fall back to legacy issues endpoint
            const response = await fetch(API_ENDPOINTS.ISSUES_API, {
                method: 'HEAD'
            });

            if (!response.ok) {
                console.error('Order system check failed:', response.status);
                return {
                    success: false,
                    message: ERROR_MESSAGES.SYSTEM_UNAVAILABLE
                };
            }

            console.log('Order system check successful (legacy endpoint)');
            return {
                success: true,
                message: 'Order system is ready'
            };
        } catch (error) {
            console.error('Error checking order system connection:', error);
            return {
                success: false,
                message: ERROR_MESSAGES.CONNECTION_ERROR
            };
        }
    }

    async createOrder(orderData, retryCount = 0) {
        // First check if order system connection is working
        const connectionCheck = await this.checkGitHubConnection();
        if (!connectionCheck.success) {
            throw new Error(connectionCheck.message);
        }

        const order = {
            id: 'ord_' + Math.random().toString(36).substr(2, 9),
            ...orderData,
            status: ORDER_STATUS.PENDING,
            createdAt: new Date().toISOString()
        };

        try {
            console.log('Creating order...');
            
            // Try the new orders endpoint first, fall back to issues if it fails
            let response;
            try {
                response = await fetch(
                    API_ENDPOINTS.ORDERS_API,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(order)
                    }
                );
                
                // If order endpoint fails with 404 (not deployed yet), fall back to issues
                if (response.status === 404) {
                    throw new Error('Order endpoint not available');
                }
            } catch (error) {
                console.log('New order endpoint failed, falling back to issues:', error);
                response = await fetch(
                    API_ENDPOINTS.ISSUES_API,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            title: `New Order: ${order.id}`,
                            body: `ORDER_DATA:\n${JSON.stringify(order, null, 2)}\nEND_ORDER_DATA`
                        })
                    }
                );
            }

            console.log('Create order response:', {
                status: response.status,
                statusText: response.statusText
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Full error response:', errorData);
                
                let errorMessage;
                switch (response.status) {
                    case 401:
                        errorMessage = ERROR_MESSAGES.AUTH_FAILED;
                        break;
                    case 403:
                        errorMessage = ERROR_MESSAGES.RATE_LIMIT.replace('{minutes}', '5');
                        break;
                    case 404:
                        errorMessage = ERROR_MESSAGES.SYSTEM_UNAVAILABLE;
                        break;
                    case 422:
                        errorMessage = ERROR_MESSAGES.INVALID_ORDER;
                        break;
                    default:
                        errorMessage = `Error: ${errorData.message || 'Unknown error'}`;
                }
                
                console.error('Order creation failed:', {
                    status: response.status,
                    statusText: response.statusText,
                    error: errorData
                });
                
                // Handle server errors with retries
                if ([500, 502, 503, 504].includes(response.status) && retryCount < this.MAX_RETRIES) {
                    console.log(`Server error, retrying in ${this.RETRY_DELAY}ms... (Attempt ${retryCount + 1}/${this.MAX_RETRIES})`);
                    await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY));
                    return this.createOrder(orderData, retryCount + 1);
                }

                throw new Error(errorMessage);
            }

            const issueData = await response.json();
            console.log('Order created successfully:', issueData);
            
            // Store order info for customer reference
            this.currentOrder = {
                id: order.id,
                issueNumber: issueData.number,
                status: order.status,
                total: orderData.order.total,
                message: 'Your order is being processed. Please wait for confirmation.'
            };
            localStorage.setItem('currentOrder', JSON.stringify(this.currentOrder));
            
            console.log(`Order ${order.id} created as GitHub issue #${issueData.number}`);
            return order;
        } catch (error) {
            console.error('Error saving order:', error);
            throw error;
        }
    }

    getCurrentOrder() {
        if (!this.currentOrder) {
            const stored = localStorage.getItem('currentOrder');
            if (stored) {
                this.currentOrder = JSON.parse(stored);
            }
        }
        return this.currentOrder;
    }

    clearCurrentOrder() {
        this.currentOrder = null;
        localStorage.removeItem('currentOrder');
    }
}