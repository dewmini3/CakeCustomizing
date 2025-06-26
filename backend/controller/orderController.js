const Order = require("../models/Order");

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('orderItems.product', 'product_name', 'product_price','product_image') // Populate product details
            .exec();

        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching orders", error });
    }
};

module.exports = { getOrders };
