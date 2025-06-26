const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const discontinued_productSchema = new Schema({
   
    _id:{
        type: String, 
    },
    discontinued_product_name: {
        type: String,
        required: true,
    },
    discontinued_product_weight:{
        type: String,
        required: true,
    },
    discontinued_product_description: {
        type: String,
        required: true
    },
    discontinued_product_price: {
        type: String,
        required: true
    },
    discontinued_product_category: {
        discontinued_flavor:[String],
        discontinued_occasion:[String],
        discontinued_specifications:[String]
    },
    discontinued_product_image: {
        type: String,
        required: true
    },
    discontinued_ingredients: [
        {
        _id: String,
          name: String,       // e.g., sugar
          quantity: Number,   // e.g., 200
          unit: String        // e.g., grams
        }
      ],
    deletedAt : {
        type: Date,
        required: false
    }

})


module.exports = Discontinued_product = mongoose.model('Discontinued_product', discontinued_productSchema);;