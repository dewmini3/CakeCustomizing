const express = require("express");
const router = express.Router();
const Ingredient2 = require("../models/Ingredient2");
const getNextSequenceValue = require("../utils/sequence");
const getSequenceValue = require("../utils/sequence");
const prefix="ING-";


http://localhost:4000/api/ingredient2/add

router.post('/add', async (req, res) => {
    try {
        // Get the next sequence number (example: 1, 2, 3, ...)
        
        const sequenceName = "ingredienttid";
      const newId = await getNextSequenceValue(prefix, sequenceName);
        // Create a new ingredient with generated _id + request body
        const ingredient2 = new Ingredient2({
            _id: newId,
            name: req.body.name,
            stock_quantity: req.body.stock_quantity,
            unit: req.body.unit
        });

        await ingredient2.save();
        res.json({ message: 'Ingredient added successfully', _id: newId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


http://localhost:4000/api/ingredient2

router.get('/', async (req, res) => {
    const ingredients = await Ingredient2.find();
    res.json(ingredients);
  });




  http://localhost:4000/api/ingredient2/update/fccfg

router.put('/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;

        const updatedIngredient = await Ingredient2.findByIdAndUpdate(
            id,
            updatedData,
            { new: true, runValidators: true }
        );

        if (!updatedIngredient) {
            return res.status(404).json({ message: 'Ingredient not found' });
        }

        res.json({
            message: 'Ingredient updated successfully',
            ingredient: updatedIngredient
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;