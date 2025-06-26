const express = require('express');
const router = express.Router();
const Option = require('../models/Option');
const Ingredient = require('../models/Ingredient2');
const getNextSequenceValue = require("../utils/sequence");
const getSequenceValue = require("../utils/sequence");
const prefix="OPT-";

// Helper function to validate ingredients
const validateIngredients = (ingredients) => {
  if (!Array.isArray(ingredients)) return false;
  return ingredients.every(ing => 
    ing._id && 
    ing.name && 
    typeof ing.quantity === 'number' && 
    ing.quantity > 0
  );
};

// Add new option
router.post('/add', async (req, res) => {
  try {
    const { option_name, option_flavor, option_size, option_shape, option_price, option_specifications, ingredients } = req.body;

    // Validate required fields
    if (!option_name || !option_flavor || !option_size || !option_shape || option_price === undefined) {
      return res.status(400).json({
        status: 'Error',
        message: 'Missing required fields'
      });
    }

    // Validate option size
    if (!['6', '8', '10', '12'].includes(option_size)) {
      return res.status(400).json({
        status: 'Error',
        message: 'Invalid option size. Must be one of: 6, 8, 10, 12'
      });
    }

    // Validate option shape
    if (!['round', 'square', 'heart'].includes(option_shape.toLowerCase())) {
      return res.status(400).json({
        status: 'Error',
        message: 'Invalid option shape. Must be one of: round, square, heart'
      });
    }

    // Validate price
    const price = Number(option_price);
    if (isNaN(price) || price < 0) {
      return res.status(400).json({
        status: 'Error',
        message: 'Invalid price. Must be a positive number'
      });
    }

    // Validate ingredients and check if they exist in ingredient2
    if (!validateIngredients(ingredients)) {
      return res.status(400).json({
        status: 'Error',
        message: 'Invalid ingredients format'
      });
    }

    // Verify all ingredients exist in ingredient2
    for (const ingredient of ingredients) {
      const existingIngredient = await Ingredient.findById(ingredient._id);
      if (!existingIngredient) {
        return res.status(400).json({
          status: 'Error',
          message: `Ingredient with ID ${ingredient._id} not found`
        });
      }
    }

    // Check for duplicate option
    const existingOption = await Option.findOne({
      option_name: option_name.toLowerCase(),
      option_flavor: option_flavor.toLowerCase(),
      option_size,
      option_shape: option_shape.toLowerCase()
    });

    if (existingOption) {
      return res.status(400).json({
        status: 'Error',
        message: 'Option already exists'
      });
    }

    const sequenceName = "optionid";
    const newId = await getNextSequenceValue(prefix, sequenceName);

    // Create new option
    const newOption = new Option({
      _id: newId,
      option_name: option_name.toLowerCase(),
      option_flavor: option_flavor.toLowerCase(),
      option_size,
      option_shape: option_shape.toLowerCase(),
      option_price: price,
      option_specifications: option_specifications || '',
      ingredients: parsedIngredients,
    //   ingredients: ingredients.map(ing => ({
    //     _id: ing._id,
    //     name: ing.name.toLowerCase(),
    //     quantity: Number(ing.quantity),
    //     unit: ing.unit || 'grams'
    //   }))
            
    });
    for (const item of parsedIngredients) {
            await Ingredient.findByIdAndUpdate(
              item.ingredientId,
              { $inc: { stock: -item.amount } },
              { new: true }
            );
        }

    // // Update ingredient stock
    // for (const item of parsedIngredients) {
    //     await Ingredient.findByIdAndUpdate(
    //       item.ingredientId,
    //       { $inc: { stock: -item.amount } },
    //       { new: true }
    //     );

    await newOption.save();

    res.status(201).json({
      status: 'Success',
      message: 'Option added successfully',
      data: newOption
    });

 } catch (error) {
    console.error('Error adding option:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Failed to add option',
      error: error.message
    });
  }
});

// Get all options
router.get('/', async (req, res) => {
  try {
    const options = await Option.find().sort({ createdAt: -1 });
    res.json({
      status: 'Success',
      data: options
    });
  } catch (error) {
    console.error('Error fetching options:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Failed to fetch options',
      error: error.message
    });
  }
});

// Update option
router.put('/update/:option_id', async (req, res) => {
  try {
    const { option_id } = req.params;
    const { option_name, option_flavor, option_size, option_shape, option_price, option_specifications, ingredients } = req.body;

    // Find existing option
    const existingOption = await Option.findById(option_id);
    if (!existingOption) {
      return res.status(404).json({
        status: 'Error',
        message: 'Option not found'
      });
    }

    // Validate required fields if provided
    if (option_size && !['6', '8', '10', '12'].includes(option_size)) {
      return res.status(400).json({
        status: 'Error',
        message: 'Invalid option size. Must be one of: 6, 8, 10, 12'
      });
    }

    if (option_shape && !['round', 'square', 'heart'].includes(option_shape.toLowerCase())) {
      return res.status(400).json({
        status: 'Error',
        message: 'Invalid option shape. Must be one of: round, square, heart'
      });
    }

    if (option_price !== undefined) {
      const price = Number(option_price);
      if (isNaN(price) || price < 0) {
        return res.status(400).json({
          status: 'Error',
          message: 'Invalid price. Must be a positive number'
        });
      }
    }

    // Check for duplicate option if name/flavor/size/shape is being changed
    if (option_name || option_flavor || option_size || option_shape) {
      const duplicateOption = await Option.findOne({
        _id: { $ne: option_id },
        option_name: (option_name || existingOption.option_name).toLowerCase(),
        option_flavor: (option_flavor || existingOption.option_flavor).toLowerCase(),
        option_size: option_size || existingOption.option_size,
        option_shape: (option_shape || existingOption.option_shape).toLowerCase()
      });

      if (duplicateOption) {
        return res.status(400).json({
          status: 'Error',
          message: 'Option with these specifications already exists'
        });
      }
    }

    // Update ingredient stock
    if (ingredients) {
      if (!validateIngredients(ingredients)) {
        return res.status(400).json({
          status: 'Error',
          message: 'Invalid ingredients format'
        });
      }

      // Verify all ingredients exist in ingredient2
      for (const ingredient of ingredients) {
        const existingIngredient = await Ingredient.findById(ingredient._id);
        if (!existingIngredient) {
          return res.status(400).json({
            status: 'Error',
            message: `Ingredient with ID ${ingredient._id} not found`
          });
        }
      }

      // Restore old ingredient stock
      for (const oldIng of existingOption.ingredients) {
        await Ingredient.findByIdAndUpdate(
          oldIng._id,
          { $inc: { stock: oldIng.quantity } }
        );
      }

      // Deduct new ingredient stock
      for (const newIng of ingredients) {
        await Ingredient.findByIdAndUpdate(
          newIng._id,
          { $inc: { stock: -newIng.quantity } }
        );
      }
    }

    // Update option
    const updatedOption = await Option.findByIdAndUpdate(
      option_id,
      {
        ...(option_name && { option_name: option_name.toLowerCase() }),
        ...(option_flavor && { option_flavor: option_flavor.toLowerCase() }),
        ...(option_size && { option_size }),
        ...(option_shape && { option_shape: option_shape.toLowerCase() }),
        ...(option_price !== undefined && { option_price: Number(option_price) }),
        ...(option_specifications !== undefined && { option_specifications }),
        ...(ingredients && {
          ingredients: ingredients.map(ing => ({
            _id: ing._id,
            name: ing.name.toLowerCase(),
            quantity: Number(ing.quantity),
            unit: ing.unit || 'grams'
          }))
        })
      },
      { new: true }
    );

    res.json({
      status: 'Success',
      message: 'Option updated successfully',
      data: updatedOption
    });

  } catch (error) {
    console.error('Error updating option:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Failed to update option',
      error: error.message
    });
  }
});

// Delete option
router.delete('/delete/:option_id', async (req, res) => {
  try {
    const { option_id } = req.params;

    // Find the option to get its ingredients
    const option = await Option.findById(option_id);
    if (!option) {
      return res.status(404).json({
        status: 'Error',
        message: 'Option not found'
      });
    }

    // Restore ingredient stock
    for (const ingredient of option.ingredients) {
      await Ingredient.findByIdAndUpdate(
        ingredient._id,
        { $inc: { stock: ingredient.quantity } }
      );
    }

    // Delete the option
    await Option.findByIdAndDelete(option_id);

    res.json({
      status: 'Success',
      message: 'Option deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting option:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Failed to delete option',
      error: error.message
    });
  }
});

module.exports = router;
