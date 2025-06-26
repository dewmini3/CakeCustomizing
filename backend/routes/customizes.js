const express = require('express');
const router = express.Router();
const Customize = require('../models/Customize');
const Option = require('../models/Option');
const getNextSequenceValue = require("../utils/sequence");
const getSequenceValue = require("../utils/sequence");
const prefix = "CSM-";

// Get all customizes
router.get('/', async (req, res) => {
  try {
    const customizes = await Customize.find().sort({ createdAt: -1 });
    res.json({
      status: 'Success',
      data: customizes
    });
  } catch (error) {
    console.error('Error fetching customizes:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Failed to fetch customizes',
      error: error.message
    });
  }
});

// Add new customize
router.post('/add', async (req, res) => {
  try {
    const {
      custom_size,
      custom_shape,
      custom_base,
      custom_filling,
      custom_frosting,
      custom_decorations,
      custom_price,
      custom_specifications,
      ingredients
    } = req.body;

    // Validate required fields
    if (!custom_size || !custom_shape || !custom_base || !custom_filling || !custom_frosting || !custom_decorations) {
      return res.status(400).json({
        status: 'Error',
        message: 'Missing required fields'
      });
    }

    // Validate size and shape
    if (!['6', '8', '10', '12'].includes(custom_size)) {
      return res.status(400).json({
        status: 'Error',
        message: 'Invalid size. Must be one of: 6, 8, 10, 12'
      });
    }

    if (!['round', 'square', 'heart'].includes(custom_shape.toLowerCase())) {
      return res.status(400).json({
        status: 'Error',
        message: 'Invalid shape. Must be one of: round, square, heart'
      });
    }

    // Check for duplicate customize
    const existingCustomize = await Customize.findOne({
      custom_size,
      custom_shape: custom_shape.toLowerCase(),
      custom_base,
      custom_filling,
      custom_frosting,
      custom_decorations
    });

    if (existingCustomize) {
      return res.status(400).json({
        status: 'Error',
        message: 'Customize already exists'
      });
    }

    const sequenceName = "customizeid";
    const newId = await getNextSequenceValue(prefix, sequenceName);

    // Create new customize
    const newCustomize = new Customize({
      _id: newId,
      custom_size,
      custom_shape: custom_shape.toLowerCase(),
      custom_base,
      custom_filling,
      custom_frosting,
      custom_decorations,
      custom_price,
      custom_specifications: custom_specifications || '',
      ingredients
    });

    await newCustomize.save();

    res.status(201).json({
      status: 'Success',
      message: 'Customize added successfully',
      data: newCustomize
    });

  } catch (error) {
    console.error('Error adding customize:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Failed to add customize',
      error: error.message
    });
  }
});

// Get available options for customization
router.get('/available-options', async (req, res) => {
  try {
    const { size, shape } = req.query;

    if (!size || !shape) {
      return res.status(400).json({
        status: 'Error',
        message: 'Size and shape are required'
      });
    }

    // Get all options matching the size and shape
    const options = await Option.find({
      option_size: size,
      option_shape: shape.toLowerCase()
    });

    // Group options by type
    const groupedOptions = {
      cake_base: options.filter(opt => opt.option_name === 'cake base'),
      filling: options.filter(opt => opt.option_name === 'filling'),
      frosting: options.filter(opt => opt.option_name === 'frosting'),
      decorations: options.filter(opt => opt.option_name === 'decorations')
    };

    res.json({
      status: 'Success',
      data: groupedOptions
    });

  } catch (error) {
    console.error('Error fetching available options:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Failed to fetch available options',
      error: error.message
    });
  }
});

module.exports = router; 