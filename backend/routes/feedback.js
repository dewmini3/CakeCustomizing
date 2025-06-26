// feedbackRoutes.js
const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const Product = require('../models/Product');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Get all feedback
router.get('/', async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get feedback by product
router.get('/product/:productId', async (req, res) => {
  try {
    const feedback = await Feedback.find({ product_id: req.params.productId }).sort({ createdAt: -1 });
    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get average rating
router.get('/product/:productId/average', async (req, res) => {
  try {
    const result = await Feedback.aggregate([
      { $match: { product_id: req.params.productId } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          count: { $sum: 1 }
        }
      }
    ]);

    if (result.length === 0) return res.status(200).json({ averageRating: 0, count: 0 });

    const averageRating = parseFloat(result[0].averageRating.toFixed(1));
    const count = result[0].count;

    res.status(200).json({ averageRating, count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new feedback
router.post('/', async (req, res) => {
  const {
    product_id,
    product_name,
    customer_name,
    email,
    address,
    rating,
    rating_label,
    comment,
    cake_height
  } = req.body;

  if (!product_id || !product_name || !customer_name || !rating || !rating_label || !cake_height || !address) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const feedback = new Feedback({
      product_id,
      product_name,
      customer_name,
      email,
      address,
      rating,
      rating_label,
      comment,
      cake_height
    });

    await feedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully' });

    if (email) {
      try {
        const formattedDate = new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);

        const mailOptions = {
          from: `"Chara Cakes" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: 'Thank You for Your Feedback - Chara Cakes',
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
              <div style="text-align: center; background-color: #774E9B; color: white; padding: 15px; border-radius: 5px 5px 0 0;">
                <h1>Thank You for Your Feedback!</h1>
              </div>
              <div style="padding: 20px;">
                <p>Dear ${customer_name},</p>
                <p>Thank you for your feedback on <strong>${product_name}</strong>.</p>

                <div style="background-color: #f9f5ff; border-left: 4px solid #774E9B; padding: 15px; margin: 20px 0;">
                  <h3>Your Rating: ${rating_label}</h3>
                  <div style="font-size: 24px; color: #FF85B3;">${stars}</div>
                  <p><strong>Cake Grade:</strong> ${cake_height}</p>
                  ${comment ? `<p><strong>Comment:</strong> "${comment}"</p>` : ''}
                  <p><strong>Address:</strong> ${address}</p>
                </div>

                <p>We appreciate your time and support!</p>
                <p>Warm regards,<br>The Chara Cakes Team</p>
                <hr/>
                <p style="font-size: 12px; color: gray;">Submitted on ${formattedDate}</p>
              </div>
            </div>
          `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Confirmation email sent to ${email}`);
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
      }
    }

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update feedback
router.patch('/:id', async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) return res.status(404).json({ message: 'Feedback not found' });

    if (req.body.rating && (req.body.rating < 1 || req.body.rating > 5 || !Number.isInteger(Number(req.body.rating)))) {
      return res.status(400).json({ message: 'Rating must be an integer between 1 and 5' });
    }

    if (req.body.rating) feedback.rating = req.body.rating;
    if (req.body.comment !== undefined) feedback.comment = req.body.comment;
    if (req.body.address !== undefined) feedback.address = req.body.address;

    const updatedFeedback = await feedback.save();
    res.status(200).json(updatedFeedback);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete feedback
router.delete('/:id', async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) return res.status(404).json({ message: 'Feedback not found' });

    await Feedback.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
