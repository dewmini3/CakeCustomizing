
    async function getOrders() {
        try {
            const orders = await orders.find()
                .populate('orderItems.product', 'product_name product_price product_image') // Populate product details
                .exec();
    
            console.log(orders);
        } catch (error) {
            console.error(error);
        }
    }
    
    getOrders();