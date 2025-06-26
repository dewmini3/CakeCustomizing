import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const [selectAll, setSelectAll] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Example cart item - in a real app this would come from your cart state/context
  const cartItem = {
    name: "Chocolate Birthday Cake - Special Edition",
    price: 5213.55,
    discountedPrice: 2942.36,
    discount: 43,
    image: "/images/black-forest.jpg",
    status: "ALMOST SOLD OUT"
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
  };

  return (
    <div className="cart-container">
      <div className="cart-header">
        <Link to="/" className="breadcrumb">Home</Link>
        <span className="breadcrumb-separator">›</span>
        <span className="current-page">Cart</span>
      </div>

      {/* Free shipping banner */}
      <div className="shipping-banner">
        <div className="banner-content">
          <span className="check-icon">✓</span>
          <span>Free shipping special for you</span>
          <span className="offer-tag">Limited-time offer</span>
        </div>
      </div>

      {/* Cart items section */}
      <div className="cart-content">
        <div className="cart-items">
          <div className="select-all-header">
            <label className="select-all">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
              />
              <span>Select all (1)</span>
            </label>
            <button className="more-options">⋮</button>
          </div>

          {/* Cart item */}
          <div className="cart-item">
            <div className="item-checkbox">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={() => setSelectAll(!selectAll)}
              />
            </div>
            <div className="item-image">
              <img src={cartItem.image} alt={cartItem.name} />
              {cartItem.status && (
                <span className="status-badge">{cartItem.status}</span>
              )}
            </div>
            <div className="item-details">
              <h3>{cartItem.name}</h3>
              <div className="item-pricing">
                <div className="price">
                  <span className="current-price">LKR {cartItem.discountedPrice.toFixed(2)}</span>
                  <span className="original-price">LKR {cartItem.price.toFixed(2)}</span>
                  <span className="discount-tag">-{cartItem.discount}%</span>
                </div>
                <div className="quantity-selector">
                  <select 
                    value={quantity} 
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Item total:</span>
            <span>LKR {cartItem.price.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Item discount:</span>
            <span className="discount">-LKR {(cartItem.price - cartItem.discountedPrice).toFixed(2)}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>LKR {cartItem.discountedPrice.toFixed(2)}</span>
          </div>
          <p className="payment-note">Please refer to your final actual payment amount.</p>
          <button className="checkout-button">
            Checkout ({quantity})
            <div className="stock-warning">
              <span>!</span> {quantity} almost sold out
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart; 