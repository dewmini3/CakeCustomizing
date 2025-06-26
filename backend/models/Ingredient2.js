const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ingredient2Schema = new Schema({
  _id: { type: String },
  name: { type: String, required: true, unique: true },
  stock_quantity: { type: Number, required: true },
  unit: { type: String, required: true }
});

const Ingredient2 = mongoose.model('Ingredient2', ingredient2Schema);

module.exports = Ingredient2;
