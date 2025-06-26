import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import './CakeDetails.css';
import ProductRatings from '../components/FeedbackUser/Feedbacks';
import RatingForm from '../components/FeedbackUser/FeedbackForm';

const CakeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cake, setCake] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [refreshRatings, setRefreshRatings] = useState(false);

  useEffect(() => {
    const fetchCakeDetails = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:4000/api/product/get/${id}`);
        setCake(res.data.Product);
      } catch (error) {
        setCake(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCakeDetails();
  }, [id]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    // Implement add to cart functionality
    console.log('Adding to cart:', { ...cake, quantity });
  };

  const handleRatingSubmitted = () => {
    setRefreshRatings(!refreshRatings);
  };

  if (loading) {
    return (
      <div className="cake-details-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (!cake) {
    return (
      <div className="cake-details-container">
        <div className="error-message">
          <h2>Cake not found</h2>
          <button className="back-button" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cake-details-container">
      <div className="cake-details-content">
        <div className="cake-image-section">
          <img src={cake.product_image || cake.image} alt={cake.product_name} className="cake-detail-image" />
        </div>
        <div className="cake-info-section">
          <h1>{cake.product_name}</h1>
          <div className="cake-price">${cake.product_price}</div>
          <div className="cake-description">
            <h3>Description</h3>
            <p>{cake.product_description}</p>
          </div>
          {cake.ingredients && (
            <div className="cake-ingredients">
              <h3>Ingredients</h3>
              <ul>
                {cake.ingredients.map((ingredient, index) => (
                  <li key={index}>
                    {ingredient.name} - {ingredient.quantity} {ingredient.unit}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="cake-actions">
            <div className="quantity-selector">
              <label htmlFor="quantity">Quantity:</label>
              <div className="quantity-controls">
                <button 
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  className="quantity-btn"
                >-</button>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={handleQuantityChange}
                  min="1"
                />
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="quantity-btn"
                >+</button>
              </div>
            </div>
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
          {cake.allergens && (
            <div className="cake-allergens">
              <h3>Allergen Information</h3>
              <p>{cake.allergens}</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Ratings section */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>
        <ProductRatings productId={id} key={refreshRatings} />
        <RatingForm 
          productId={id} 
          productName={cake.product_name}
          onRatingSubmitted={handleRatingSubmitted}
        />
      </div>
    </div>
  );
};

export default CakeDetails;