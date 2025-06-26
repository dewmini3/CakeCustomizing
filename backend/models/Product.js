const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    
    _id: { 
        type: String,
    }, 
    product_name: {
        type: String,
        required: true,
    },
    product_weight:{
        type: String,
        required: true,
    },
    product_description: {
        type: String,
        required: true
    },
    product_price: {
        type: Number,
        required: true
    },
    product_category: {
        flavor:[String],
        occasion:[String],
        specifications:[String]

    },
    product_image: {
        type: String,
        required: false
    },
    ingredients: [
        {
        _id: String,
          name: String,       // e.g., sugar
          quantity: Number,   // e.g., 200
          unit: String        // e.g., grams
        }
      ]


});
    


module.exports = Product = mongoose.model('Product', productSchema);