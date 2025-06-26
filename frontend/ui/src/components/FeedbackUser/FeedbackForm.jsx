import React, { useState } from 'react';
import axios from 'axios';

const styles = {
  outerContainer: { padding: '20px', display: 'flex', justifyContent: 'center' },
  container: { width: '100%', maxWidth: '600px', background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' },
  formContent: { display: 'flex', flexDirection: 'column' },
  header: { marginBottom: '20px', textAlign: 'center' },
  formGroup: { marginBottom: '15px' },
  label: { display: 'block', marginBottom: '5px', fontWeight: 'bold' },
  input: { width: '100%', padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' },
  textarea: { width: '100%', height: '100px', padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' },
  starContainer: { display: 'flex', alignItems: 'center' },
  star: { fontSize: '24px', cursor: 'pointer', marginRight: '5px' },
  ratingLabel: { marginLeft: '10px', fontSize: '16px', fontWeight: 'bold' },
  submitButton: { padding: '10px 20px', fontSize: '16px', fontWeight: 'bold', color: '#fff', backgroundColor: '#28a745', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  disabledButton: { backgroundColor: '#ccc', cursor: 'not-allowed' },
  successMessage: { color: 'green', fontWeight: 'bold', marginBottom: '15px' },
  errorMessage: { color: 'red', fontWeight: 'bold', marginBottom: '15px' },
};

const RatingForm = ({ productId, productName, onRatingSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [comment, setComment] = useState('');
  const [cakeHeight, setCakeHeight] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRatingClick = (selectedRating) => {
    setRating(selectedRating);
  };

  const getRatingLabel = (rating) => {
    switch (rating) {
      case 1: return 'Poor';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Very Good';
      case 5: return 'Excellent';
      default: return '';
    }
  };

  const validateEmail = (email) => {
    if (!email) return true;
    const re = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customerName.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!address.trim()) {
      setError('Please enter your address');
      return;
    }
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    if (email && !validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!cakeHeight) {
      setError('Please select the cake height');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await axios.post('http://localhost:4000/api/feedback', {
        product_id: productId,
        product_name: productName,
        customer_name: customerName,
        email,
        address,
        rating,
        rating_label: getRatingLabel(rating),
        comment,
        cake_height: cakeHeight,
      });

      const emailMessage = email 
        ? ' A confirmation has been sent to your email address.'
        : '';

      setSuccess(`Thank you for your feedback!${emailMessage}`);
      setCustomerName('');
      setEmail('');
      setAddress('');
      setRating(0);
      setComment('');
      setCakeHeight('');
      setHoveredRating(0);

      if (onRatingSubmitted) {
        onRatingSubmitted();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setError(
        error?.response?.data?.message || 'Failed to submit your review. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.outerContainer}>
      <div style={styles.container}>
        <div style={styles.formContent}>
          <h3 style={styles.header}>Write a Review</h3>

          {success ? (
            <div style={styles.successMessage}>{success}</div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && <div style={styles.errorMessage}>{error}</div>}

              <div style={styles.formGroup}>
                <label htmlFor="customerName" style={styles.label}>Your Name</label>
                <input
                  type="text"
                  id="customerName"
                  value={customerName}
                  onChange={(e) =>
                    setCustomerName(e.target.value.replace(/[^a-zA-Z\s]/g, ''))
                  }
                  style={styles.input}
                  placeholder="Enter your name"
                />
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="email" style={styles.label}>Your Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value.replace(/[^a-zA-Z0-9@.]/g, ''))
                  }
                  style={styles.input}
                  placeholder="Enter your email for a confirmation"
                />
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="address" style={styles.label}>Your Address</label>
                <input
                  type="text"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={styles.input}
                  placeholder="Enter your address"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Rating</label>
                <div style={styles.starContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      onClick={() => handleRatingClick(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      style={{
                        ...styles.star,
                        color: (hoveredRating || rating) >= star ? '#FFD700' : '#e4e5e9',
                      }}
                    >
                      ★
                    </span>
                  ))}
                  {rating > 0 && (
                    <span style={styles.ratingLabel}>
                      {getRatingLabel(rating)}
                    </span>
                  )}
                </div>
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="comment" style={styles.label}>
                  Your Review (Optional)
                </label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  style={styles.textarea}
                  placeholder="Tell us what you liked or didn't like about this product..."
                />
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="cakeHeight" style={styles.label}>
                  Cake Grade
                </label>
                <select
                  id="cakeHeight"
                  value={cakeHeight}
                  onChange={(e) => setCakeHeight(e.target.value)}
                  style={styles.input}
                  required
                >
                  <option value="">Select height</option>
                  <option value="High">High</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    ...styles.submitButton,
                    ...(loading ? styles.disabledButton : {})
                  }}
                >
                  {loading ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RatingForm;
