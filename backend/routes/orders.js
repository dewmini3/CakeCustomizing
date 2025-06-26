const express = require("express");
const router = express.Router();
const Completed_order =require("../models/completed_order");
const Order =require("../models/Order");
const getNextSequenceValue = require("../utils/sequence");
const getSequenceValue = require("../utils/sequence");
const prefix="ORD-";
const { getOrders } = require("../controller/orderController");
router.get('/orders', getOrders);
Product = require("../models/Product");


http://localhost:3000/api/order/add

router.route("/add").post(async (req, res) => {
    try {
            console.log("Request Body:", req.body);
    
            const sequenceName = "orderid";
    
            const { 
                customer_id,
                orderItems,
                deliveryAddress,
                paymentMethod,
                itemsPrice,
                deliveryfee,
                taxPrice,
                totalPrice,
                createdAt, } = req.body;
    
            
            const newId = await getNextSequenceValue(prefix, sequenceName);
            
            const newOrder = new Order({
                _id: newId,
                customer_id,
                orderItems,
                deliveryAddress,
                paymentMethod,
                itemsPrice,
                deliveryfee,
                taxPrice,
                totalPrice,
                createdAt: new Date(),
            
            })
            if (!orderItems || orderItems.length === 0) {
                return res.status(400).json({ error: "Order items are required" });
            }
            
            await newOrder.save() 
            
            res.status(201).json({ status: "Order added successfully.", order: newOrder });
        } catch (err) {
            console.error(err);
            res.status(500).json({ status: "Error adding order.", error: err.message });
        }
    });
    
    

    
    

http://localhost:3000/api/order

router.route("/").get(async(req,res)=>{

    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}) 

http://localhost:3000/api/order/completed/crntpdct

router.route("/completed/:order_id").delete(async (req, res) => {
    try {
        const _id = req.params.order_id;

        const completed  = await Order.findById(_id);
        if (!completed) {
            return res.status(404).json({ status: "Order not found" });
        }

        const completed_order = new Completed_order({
            _id: completed._id,
        
            //customer_id:completed._id,
            orderItems:completed.orderItems,
            deliveryAddress:completed.deliveryAddress,
            paymentMethod:completed.paymentMethod,
            itemsPrice:completed.itemsPrice,
            deliveryfee:completed.deliveryfee,
            taxPrice:completed.taxPrice,
            totalPrice:completed.totalPrice,
            isPaid: completed.isPaid,
            paidAt:completed.paidAt,
            deliveredAt: new Date(),
        });

        await completed_order.save();
        await Order.findByIdAndDelete(_id);

        res.status(200).json({ status: "Order deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "Error deleting order", error: err.message });
    }
});


http://localhost:3000/api/order/update/crntpdct

router.route("/update/:order_id").put(async (req, res) => {
    const _id = req.params.order_id;
    const {
        customer_id,
        orderItems,
        deliveryAddress,
        paymentMethod,
        itemsPrice,
        deliveryfee,
        taxPrice,
        totalPrice,
        updatedAt} = req.body;

    const updateOrder ={
        customer_id,
        orderItems,
        deliveryAddress,
        paymentMethod,
        itemsPrice,
        deliveryfee,
        taxPrice,
        totalPrice,
        updatedAt: new Date()
        
    }

    const update = await Order.findByIdAndUpdate(_id, updateOrder)
    .then(()=>{
        res.status(200).send({status: "Order Updated"})
    }).catch((err) =>{
        console.log(err);
        res.status(500).send({status: "Error with updating data"});
    })
})

http://localhost:3000/api/order/delete/crntpdcts

router.route("/delete/:order_id").delete(async (req, res) => {
    const _id = req.params.order_id;

    await Order.findByIdAndDelete(_id)
        .then(()=>{
            res.status(200).send({status: "Order deleted"})
        }).catch((err) => {
            console.log(err.message);
            res.status(500).send({status: "Error with deleting Order", error: err.message});

        })
})

http://localhost:3000/api/order/get/crntpdcts

router.route("/get/:order_id").get(async (req, res) => {
        try {
            const _id = req.params.order_id;
            const order = await Order.findById(_id).populate('orderItems.product');

           // const Order = await Order.findById(_id);
    
            if (!Order) {
                return res.status(404).json({ status: "Order not found" });
            }
    
            res.status(200).json({ status: "Order fetched", Product: Order });
        } catch (err) {
            console.error(err);
            res.status(500).json({ status: "Error fetching order", error: err.message });
        }
    });
module.exports = router;