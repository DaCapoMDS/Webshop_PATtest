class OrderManager {
    constructor() {
        // Store only current order in localStorage for customer reference
        this.currentOrder = null;
    }

    async createOrder(orderData) {
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
            const token = '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'; // GitHub personal access token
            const headers = {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            };

            // Get current counter from GitHub
            let orderNumber = 1;
            try {
                const counterResponse = await fetch(
                    `https://api.github.com/repos/${owner}/${repo}/contents/orders/counter.txt`,
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
            const orderPath = `orders/order_${orderNumber}.json`;
            
            await fetch(
                `https://api.github.com/repos/${owner}/${repo}/contents/${orderPath}`,
                {
                    method: 'PUT',
                    headers,
                    body: JSON.stringify({
                        message: `Create order ${orderNumber}`,
                        content: btoa(orderContent)
                    })
                }
            );

            // Update counter in GitHub
            const counterPath = 'orders/counter.txt';
            const counterContent = orderNumber.toString();
            
            try {
                // Try to get existing file to get its SHA
                const existingCounter = await fetch(
                    `https://api.github.com/repos/${owner}/${repo}/contents/${counterPath}`,
                    { headers }
                );
                const counterData = await existingCounter.json();
                
                await fetch(
                    `https://api.github.com/repos/${owner}/${repo}/contents/${counterPath}`,
                    {
                        method: 'PUT',
                        headers,
                        body: JSON.stringify({
                            message: `Update counter to ${orderNumber}`,
                            content: btoa(counterContent),
                            sha: counterData.sha
                        })
                    }
                );
            } catch {
                // File doesn't exist, create it
                await fetch(
                    `https://api.github.com/repos/${owner}/${repo}/contents/${counterPath}`,
                    {
                        method: 'PUT',
                        headers,
                        body: JSON.stringify({
                            message: `Create counter with value ${orderNumber}`,
                            content: btoa(counterContent)
                        })
                    }
                );
            }

            // Store order info for customer reference
            this.currentOrder = {
                id: order.id,
                orderNumber: orderNumber,
                status: order.status,
                total: orderData.order.total
            };
            localStorage.setItem('currentOrder', JSON.stringify(this.currentOrder));
            
            console.log(`Order ${orderNumber} saved to GitHub repository`);
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

// Initialize order manager
const orderManager = new OrderManager();
