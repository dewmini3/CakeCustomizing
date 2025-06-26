const express = require("express");
const router = express.Router();
const Completed_order =require("../models/completed_order");
const order =require("../models/Order");

http://localhost:3000/api/completed_order

router.route("/").get((req,res)=>{

    Completed_order.find().then(completed_orders =>{
        res.json(completed_orders)
    }).catch(err=>{
        console.log(err);
    })
})



http://localhost:3000/api/completed_order/delete/crntpdcts

router.route("/delete/:completed_order_id").delete(async (req, res) => {
    let _id = req.params.completed_order_id;

    await Completed_order.findByIdAndDelete(_id)
        .then(()=>{
            res.status(200).send({status: "Order deleted"})
        }).catch((err) => {
            console.log(err.message);
            res.status(500).send({status: "Error with deleting Order", error: err.message});

        })
})
http://localhost:3000/api/completed_order/get/crntpdcts

router.route("/get/:completed_order_id").get(async (req, res) => {
    try {
        const _id = req.params.completed_order_id;
        const completed_order = await Completed_order.findById(_id);

        if (!completed_order) {
            return res.status(404).json({ status: "Completed order not found" });
        }

        res.status(200).json({ status: "Completed order fetched", Completed_order: completed_order });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "Error fetching completedorder", error: err.message });
    }
})


module.exports = router;