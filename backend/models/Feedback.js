const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
    product_id: {
        type: String,
        required: true,
        ref: 'Product'
    },
    product_name: {
        type: String,
        required: true
    },
    customer_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false,
        validate: {
            validator: function(v) {
                return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    address: {                            // ✅ Added address field
        type: String,
        required: true,                   // Set to true if address is mandatory
        trim: true,
        minlength: 5                      // Optional: Add minimum length
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    rating_label: {
        type: String,
        required: true,
        enum: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']
    },
    comment: {
        type: String,
        required: false
    },
    cake_height: {
        type: String,
        required: true,
        enum: ['High', 'Low']
    },
    created_at: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

feedbackSchema.pre('validate', function(next) {
    if (this.rating) {
        if (this.rating === 1) this.rating_label = 'Poor';
        else if (this.rating === 2) this.rating_label = 'Fair';
        else if (this.rating === 3) this.rating_label = 'Good';
        else if (this.rating === 4) this.rating_label = 'Very Good';
        else if (this.rating === 5) this.rating_label = 'Excellent';
        
        console.log(`Setting rating_label to ${this.rating_label} for rating ${this.rating}`);
    }
    next();
});

module.exports = mongoose.model('Feedback', feedbackSchema);
