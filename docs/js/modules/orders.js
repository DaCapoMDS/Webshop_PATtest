export class OrderManager {
    constructor() {
        // Store only current order in localStorage for customer reference
        this.currentOrder = null;
        
        // GitHub configuration
        this.owner = 'Joppinger';
        this.repo = 'Webshop';
        // PLACEHOLDER: Replace with actual issues-only token
        this.token = 'placeholder';
    }

    async createOrder(orderData, retryCount = 0) {
        const MAX_RETRIES = 3;
        const RETRY_DELAY = 2000; // 2 seconds

        const order = {
            id: 'ord_' + Math.random().toString(36).substr(2, 9),
            ...orderData,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        try {
            // GitHub API configuration
            const owner = 'Joppinger'; // Repository owner
            const repo = 'Webshop';   // Repository name
            const token = 'placeholdr'; // GitHub personal access token
            const headers = {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            };

            // Get current counter from GitHub
            let orderNumber = 1;
            try {
                const counterResponse = await fetch(
                    `https://api.github.com/repos/${owner}/${repo}/contents/docs/orders/counter.txt`,
                    { headers }
                );
                if (counterResponse.ok) {
                    const data = await counterResponse.json();
                    const content = atob(data.content);
                    orderNumber = parseInt(content.trim()) + 1;
                }
            } catch (error) {
                console.log('Counter not found, starting from 1');
            }

            // Update order with number
            order.orderNumber = orderNumber;

            // Save order to GitHub
            const orderContent = JSON.stringify(order, null, 2);
            const orderPath = `docs/orders/order_${orderNumber}.json`;
            
            await fetch(
                `https://api.github.com/repos/${owner}/${repo}/contents/${orderPath}`,
                {
                    method: 'PUT',
                    headers,
                    body: JSON.stringify({
                        title: `New Order: ${order.id}`,
                        body: `ORDER_DATA:\n${JSON.stringify(order, null, 2)}\nEND_ORDER_DATA`,
                        labels: ['order']
                    })
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                let errorMessage = 'Failed to create GitHub issue for order';
                
                switch (response.status) {
                    case 401:
                        errorMessage = 'Authentication failed. Please try again later.';
                        break;
                    case 403:
                        errorMessage = 'Rate limit exceeded. Please try again in a few minutes.';
                        break;
                    case 422:
                        errorMessage = 'Invalid order data. Please check your order and try again.';
                        break;
                    default:
                        errorMessage = `GitHub API Error: ${errorData.message || 'Unknown error'}`;
                }
                
                console.error('Order creation failed:', {
                    status: response.status,
                    statusText: response.statusText,
                    error: errorData
                });
                
                // Handle rate limiting with retries
                if (response.status === 403 && retryCount < MAX_RETRIES) {
                    console.log(`Rate limited, retrying in ${RETRY_DELAY}ms... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
                    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
                    return this.createOrder(orderData, retryCount + 1);
                }

                // Handle other transient errors
                if ([500, 502, 503, 504].includes(response.status) && retryCount < MAX_RETRIES) {
                    console.log(`Server error, retrying in ${RETRY_DELAY}ms... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
                    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
                    return this.createOrder(orderData, retryCount + 1);
                }

                throw new Error(errorMessage);
            }

            const issueData = await response.json();

            // Add order metadata as a comment
            await fetch(
                `https://api.github.com/repos/${this.owner}/${this.repo}/issues/${issueData.number}/comments`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `token ${this.token}`,
                        'Accept': 'application/vnd.github.v3+json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        body: `**Order Details**
- Created: ${new Date().toLocaleString()}
- Items: ${order.order.items.length}
- Total: €${order.order.total.toFixed(2)}
- Shipping to: ${order.shipping.country}
- Payment Method: ${order.payment.method}`
                    })
                }
            );
            
            // Store order info for customer reference
            this.currentOrder = {
                id: order.id,
                issueNumber: issueData.number,
                status: order.status,
                total: orderData.order.total
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