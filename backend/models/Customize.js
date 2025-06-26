const mongoose = require('mongoose');

const customizeSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  custom_layers: {
    type: Number,
    required: true,
    min: 1
  },
  custom_size:{
    type: String,
  },
  custom_shape:{
    type: String,
  },
  custom_bases: [{
    _id: {
      type: String,
      required: true
    },
       
    option_flavor: String,
   
    option_price: Number,
    ingredients: [{
      _id: String,
      name: String,
      quantity: Number,
      unit: String
    }]
  }],
  custom_filling: {
    _id: {
      type: String,
      required: true
    },
   
    option_flavor: String,
    
    option_price: Number,
    ingredients: [{
      _id: String,
      name: String,
      quantity: Number,
      unit: String
    }]
  },
  custom_frosting: {
    _id: {
      type: String,
      required: true
    },
   
    option_flavor: String,
    
    option_price: Number,
    ingredients: [{
      _id: String,
      name: String,
      quantity: Number,
      unit: String
    }]
  },
  custom_decorations: [{
    _id: {
      type: String,
      required: true
    },
    
    option_flavor: String,
    
    option_price: Number,
    ingredients: [{
      _id: String,
      name: String,
      quantity: Number,
      unit: String
    }]
  }],
  custom_price: {
    type: Number,
    required: true
  },
  ingredients: [{
    _id: String,
    name: String,
    quantity: Number,
    unit: String
  }],
  
});

module.exports = mongoose.model('Customize', customizeSchema);