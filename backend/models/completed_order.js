const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const completed_orderSchema = new Schema({
    
     _id: { 
            type: String,
        }, 
        /*customer: {
            type: String,
            required: true,
            ref: 'Customer',
        },*/
        orderItems: [
            {
                qty: { type: Number, required: true, default: 0 },
                name: { type: String, required: true },
                price: { type: Number, required: true, default: 0 },
                image: { type: String, required: true },
                product: {
                    type: String,
                    required: true,
                    ref: 'Product',
                },
            },
        ],
        deliveryAddress: {
            address: { type: String, required: true },
            city: { type: String, required: true },
            postalCode: { type: String, required: true },
        },
        paymentMethod: {
            type: String,
            required: true,
        },
        
        paymentResult: {
            id: { type: String },
            status: { type: String },
            update_time: { type: String },
            email_address: { type: String },
        },
        itemsPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        taxPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        deliveryfee: {
            type: Number,
            required: true,
            default: 0.0,
        },
        totalPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        isPaid: {
            type: Boolean,
            default: false,
        },
        paidAt: {
            type: Date,
        },
        deliveredAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    },
)



module.exports = Completed_order = mongoose.model('Completed_order', completed_orderSchema);