import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductRatings = ({ productId }) => {
  const [ratings, setRatings] = useState([]);
  const [filteredRatings, setFilteredRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('all');

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        // Fetch all ratings for this product
        const ratingsResponse = await axios.get(`http://localhost:4000/api/feedback/product/${productId}`);
        setRatings(ratingsResponse.data);
        setFilteredRatings(ratingsResponse.data);
        
        // Fetch average rating
        const averageResponse = await axios.get(`http://localhost:4000/api/feedback/product/${productId}/average`);
        setAverageRating(averageResponse.data.averageRating);
        setRatingCount(averageResponse.data.count);
      } catch (error) {
        console.error('Error fetching ratings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (productId) {
      fetchRatings();
    }
  }, [productId]);

  useEffect(() => {
    // Filter ratings based on search term and rating filter
    let result = ratings;
    
    // Filter by rating
    if (filterRating !== 'all') {
      const ratingValue = parseInt(filterRating);
      result = result.filter(item => item.rating === ratingValue);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item => 
        item.customer_name.toLowerCase().includes(term) || 
        (item.comment && item.comment.toLowerCase().includes(term)) ||
        item.rating_label.toLowerCase().includes(term)
      );
    }
    
    setFilteredRatings(result);
  }, [searchTerm, filterRating, ratings]);

  // Function to render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} style={{ 
          color: i <= rating ? '#FFD700' : '#e4e5e9',
          fontSize: '18px',
          marginRight: '2px'
        }}>
          ★
        </span>
      );
    }
    return stars;
  };

  const handleFilterChange = (event) => {
    setFilterRating(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  if (loading) {
    return <div style={{ padding: '15px', textAlign: 'center' }}>Loading ratings...</div>;
  }

  return (
    <div style={{ 
      padding: '20px', 
      marginTop: '30px', 
      backgroundColor: '#f9f9f9', 
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ 
        borderBottom: '1px solid #ddd', 
        paddingBottom: '10px', 
        marginBottom: '15px',
        fontSize: '20px'
      }}>
        Customer Reviews
      </h3>
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <div style={{ 
          fontSize: '36px', 
          fontWeight: 'bold',
          marginRight: '15px'
        }}>
          {averageRating.toFixed(1)}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '5px' }}>
            {renderStars(Math.round(averageRating))}
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>
            Based on {ratingCount} {ratingCount === 1 ? 'review' : 'reviews'}
          </div>
        </div>
      </div>
      
      {ratings.length > 0 && (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '10px',
          marginBottom: '20px'
        }}>
          <div style={{ 
            display: 'flex',
            flexDirection: 'row',
            gap: '10px',
            flexWrap: 'wrap'
          }}>
            <div style={{ 
              flex: '1',
              minWidth: '200px'
            }}>
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={handleSearchChange}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>
            <div>
              <select
                value={filterRating}
                onChange={handleFilterChange}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  backgroundColor: 'white'
                }}
              >
                <option value="all">All Ratings</option>
                <option value="5">Excellent (5★)</option>
                <option value="4">Very Good (4★)</option>
                <option value="3">Good (3★)</option>
                <option value="2">Fair (2★)</option>
                <option value="1">Poor (1★)</option>
              </select>
            </div>
          </div>
          
          <div style={{ fontSize: '14px', color: '#666' }}>
            Showing {filteredRatings.length} of {ratings.length} reviews
          </div>
        </div>
      )}
      
      {ratings.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666' }}>No reviews yet. Be the first to leave a review!</p>
      ) : filteredRatings.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666' }}>No reviews match your search criteria.</p>
      ) : (
        <div>
          {filteredRatings.map(rating => (
            <div key={rating._id} style={{ 
              marginBottom: '20px',
              paddingBottom: '20px',
              borderBottom: '1px solid #eee'
            }}>
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px'
              }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{rating.customer_name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', marginTop: '4px' }}>
                    {renderStars(rating.rating)}
                    <span style={{ marginLeft: '8px', color: '#666', fontSize: '14px' }}>
                      {rating.rating_label}
                    </span>
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: '#888' }}>
                  {new Date(rating.created_at || rating.createdAt).toLocaleDateString()}
                </div>
              </div>
              {rating.comment && (
                <div style={{ fontSize: '15px', lineHeight: '1.5', marginTop: '10px' }}>
                  {rating.comment}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductRatings;