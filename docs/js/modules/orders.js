export class OrderManager {
    constructor() {
        // Store only current order in localStorage for customer reference
        this.currentOrder = null;
        
        // GitHub repository info
        this.owner = 'Joppinger';
        this.repo = 'Webshop';

        // Constants for retry logic
        this.MAX_RETRIES = 3;
        this.RETRY_DELAY = 2000; // 2 seconds
    }

    async checkGitHubConnection() {
        try {
            console.log('Checking GitHub connection...');
            console.log(`Repository: ${this.owner}/${this.repo}`);
            
            // Try to fetch the repository info to check connection
            const response = await fetch(
                `https://api.github.com/repos/${this.owner}/${this.repo}`,
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
                    message: `Unable to connect to order processing system. Status: ${response.status}`
                };
            }

            // Also check if we can list issues (needed for order creation)
            const issuesResponse = await fetch(
                `https://api.github.com/repos/${this.owner}/${this.repo}/issues?per_page=1`,
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
                    message: 'Order system is currently unavailable. Please try again later.'
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
                    message: `Order system is busy. Please try again in ${minutes} minutes.`
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
                message: 'Cannot connect to order system. Please check your internet connection.'
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
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        try {
            console.log('Creating order issue...');
            // Create a public issue (no authentication needed)
            const response = await fetch(
                `https://api.github.com/repos/${this.owner}/${this.repo}/issues`,
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
                
                let errorMessage = 'Failed to create order';
                
                switch (response.status) {
                    case 401:
                        errorMessage = 'Authentication failed. Please try again later.';
                        break;
                    case 403:
                        errorMessage = 'Rate limit exceeded. Please try again in a few minutes.';
                        break;
                    case 404:
                        errorMessage = 'Order system not found. Please contact support.';
                        break;
                    case 422:
                        errorMessage = 'Invalid order data. Please check your order and try again.';
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