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
            console.log('Checking GitHub connection...');
            console.log(`Repository: ${GITHUB_CONFIG.OWNER}/${GITHUB_CONFIG.REPO}`);
            
            // Try to fetch the repository info to check connection
            const response = await fetch(
                API_ENDPOINTS.GITHUB_REPO,
                {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/vnd.github.v3+json',
                        'User-Agent': 'KochiWebshop'
                    }
                }
            );

            console.log('Repository check response:', {
                status: response.status,
                statusText: response.statusText
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('GitHub connection check failed:', {
                    status: response.status,
                    message: errorData.message,
                    documentation_url: errorData.documentation_url
                });
                return {
                    success: false,
                    message: ERROR_MESSAGES.SYSTEM_UNAVAILABLE
                };
            }

            // Check if issues are enabled by trying to list them
            const issuesResponse = await fetch(
                `${API_ENDPOINTS.GITHUB_REPO}/issues?per_page=1`,
                {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/vnd.github.v3+json',
                        'User-Agent': 'KochiWebshop'
                    }
                }
            );

            console.log('Issues check response:', {
                status: issuesResponse.status,
                statusText: issuesResponse.statusText
            });

            if (!issuesResponse.ok) {
                console.error('GitHub issues check failed:', {
                    status: issuesResponse.status
                });
                return {
                    success: false,
                    message: ERROR_MESSAGES.SYSTEM_UNAVAILABLE
                };
            }

            // Check rate limit status
            const rateLimit = {
                remaining: parseInt(response.headers.get('x-ratelimit-remaining')),
                reset: parseInt(response.headers.get('x-ratelimit-reset'))
            };

            console.log('Rate limit status:', rateLimit);

            if (rateLimit.remaining < 10) {
                const resetDate = new Date(rateLimit.reset * 1000);
                const minutes = Math.ceil((resetDate - new Date()) / (1000 * 60));
                return {
                    success: false,
                    message: ERROR_MESSAGES.RATE_LIMIT.replace('{minutes}', minutes)
                };
            }

            return {
                success: true,
                message: 'Order system is ready'
            };
        } catch (error) {
            console.error('Error checking GitHub connection:', error);
            return {
                success: false,
                message: ERROR_MESSAGES.CONNECTION_ERROR
            };
        }
    }

    async createOrder(orderData, retryCount = 0) {
        // First check if GitHub connection is working
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
            console.log('Creating order issue...');
            // Create a public issue (no authentication needed)
            const response = await fetch(
                `${API_ENDPOINTS.GITHUB_REPO}/issues`,
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/vnd.github.v3+json',
                        'Content-Type': 'application/json',
                        'User-Agent': 'KochiWebshop'
                    },
                    body: JSON.stringify({
                        title: `New Order: ${order.id}`,
                        body: `ORDER_DATA:\n${JSON.stringify(order, null, 2)}\nEND_ORDER_DATA`,
                        labels: ['order']
                    })
                }
            );

            console.log('Create issue response:', {
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
                
                // Handle rate limiting with retries
                if (response.status === 403 && retryCount < this.MAX_RETRIES) {
                    console.log(`Rate limited, retrying in ${this.RETRY_DELAY}ms... (Attempt ${retryCount + 1}/${this.MAX_RETRIES})`);
                    await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY));
                    return this.createOrder(orderData, retryCount + 1);
                }

                // Handle other transient errors
                if ([500, 502, 503, 504].includes(response.status) && retryCount < this.MAX_RETRIES) {
                    console.log(`Server error, retrying in ${this.RETRY_DELAY}ms... (Attempt ${retryCount + 1}/${this.MAX_RETRIES})`);
                    await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY));
                    return this.createOrder(orderData, retryCount + 1);
                }

                throw new Error(errorMessage);
            }

            const issueData = await response.json();
            console.log('Issue created successfully:', issueData);
            
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