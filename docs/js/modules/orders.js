export class OrderManager {
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
            // Get current counter from local storage or start from 1
            let orderNumber = 1;
            const storedCounter = localStorage.getItem('orderCounter');
            if (storedCounter) {
                orderNumber = parseInt(storedCounter) + 1;
            }

            // Update order with number
            order.orderNumber = orderNumber;

            // Save order to local storage
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            orders.push(order);
            localStorage.setItem('orders', JSON.stringify(orders));

            // Update counter in local storage
            localStorage.setItem('orderCounter', orderNumber.toString());

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