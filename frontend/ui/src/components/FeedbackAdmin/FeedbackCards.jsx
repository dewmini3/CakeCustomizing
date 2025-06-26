import React from 'react';

const FeedbackCards = ({ feedbacks }) => {
  // Calculate statistics
  const totalFeedbacks = feedbacks.length;
  const averageRating = totalFeedbacks > 0
    ? (feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0) / totalFeedbacks).toFixed(1)
    : 0;
  
  const ratingCounts = {
    5: feedbacks.filter(f => f.rating === 5).length,
    4: feedbacks.filter(f => f.rating === 4).length,
    3: feedbacks.filter(f => f.rating === 3).length,
    2: feedbacks.filter(f => f.rating === 2).length,
    1: feedbacks.filter(f => f.rating === 1).length,
  };
  
  const percentages = Object.keys(ratingCounts).reduce((acc, rating) => {
    acc[rating] = totalFeedbacks > 0 ? (ratingCounts[rating] / totalFeedbacks * 100).toFixed(1) : 0;
    return acc;
  }, {});
  
  // Base style with all: unset to prevent inheritance
  const baseStyle = {
    all: 'unset',
    boxSizing: 'border-box',
    fontFamily: 'Arial, sans-serif'
  };

  return (
    <div style={{ ...baseStyle, marginBottom: '32px', display: 'block', width: '100%' }}>
      {/* Dashboard Cards */}
      <div style={{ ...baseStyle, display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '24px' }}>
        {/* Total Reviews Card */}
        <div style={{ 
          ...baseStyle,
          flex: '1',
          minWidth: '220px',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          backgroundColor: '#3498db',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{ ...baseStyle, fontSize: '16px', marginBottom: '8px', display: 'block' }}>Total Reviews</div>
          <div style={{ ...baseStyle, fontSize: '32px', fontWeight: 'bold', display: 'block' }}>{totalFeedbacks}</div>
        </div>
        
        {/* Average Rating Card */}
        <div style={{ 
          ...baseStyle,
          flex: '1',
          minWidth: '220px',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          backgroundColor: '#2ecc71',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{ ...baseStyle, fontSize: '16px', marginBottom: '8px', display: 'block' }}>Average Rating</div>
          <div style={{ ...baseStyle, display: 'flex', alignItems: 'center' }}>
            <div style={{ ...baseStyle, fontSize: '32px', fontWeight: 'bold', marginRight: '8px', display: 'block' }}>{averageRating}</div>
            <div style={{ ...baseStyle, fontSize: '18px', display: 'block' }}>★</div>
          </div>
        </div>
        
        {/* Highest Rated */}
        <div style={{ 
          ...baseStyle,
          flex: '1',
          minWidth: '220px',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          backgroundColor: '#e74c3c',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{ ...baseStyle, fontSize: '16px', marginBottom: '8px', display: 'block' }}>5-Star Reviews</div>
          <div style={{ ...baseStyle, display: 'flex', alignItems: 'center' }}>
            <div style={{ ...baseStyle, fontSize: '32px', fontWeight: 'bold', marginRight: '8px', display: 'block' }}>{ratingCounts[5]}</div>
            <div style={{ ...baseStyle, fontSize: '14px', display: 'block' }}>({percentages[5]}%)</div>
          </div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div style={{
        ...baseStyle,
        padding: '24px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        backgroundColor: '#fff',
        marginBottom: '24px',
        display: 'block'
      }}>
        <div style={{ 
          ...baseStyle, 
          fontSize: '18px', 
          marginBottom: '16px', 
          fontWeight: 'bold', 
          color: '#2c3e50',
          display: 'block'
        }}>
          Rating Distribution
        </div>
        
        {[5, 4, 3, 2, 1].map(rating => (
          <div key={rating} style={{ ...baseStyle, marginBottom: '12px', display: 'block' }}>
            <div style={{ ...baseStyle, display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
              <div style={{ ...baseStyle, width: '100px', fontSize: '14px', display: 'block' }}>
                {rating} {rating === 1 ? 'Star' : 'Stars'}
              </div>
              <div style={{ ...baseStyle, flex: '1', marginLeft: '8px', display: 'block' }}>
                <div style={{ 
                  ...baseStyle, 
                  height: '10px', 
                  width: `${percentages[rating]}%`, 
                  backgroundColor: rating >= 4 ? '#2ecc71' : rating === 3 ? '#f1c40f' : '#e74c3c',
                  borderRadius: '10px',
                  display: 'block'
                }}></div>
              </div>
              <div style={{ ...baseStyle, marginLeft: '16px', fontSize: '14px', width: '60px', textAlign: 'right', display: 'block' }}>
                {ratingCounts[rating]} ({percentages[rating]}%)
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Feedback Cards */}
      <div style={{ 
        ...baseStyle, 
        fontSize: '18px', 
        marginBottom: '16px', 
        fontWeight: 'bold', 
        color: '#2c3e50',
        display: 'block' 
      }}>
        Recent Feedback
      </div>
      <div style={{ ...baseStyle, display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {feedbacks.slice(0, 3).map((feedback) => (
          <div
            key={feedback._id}
            style={{
              ...baseStyle,
              flex: '1',
              minWidth: '300px',
              padding: '20px',
              border: '1px solid #eee',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              backgroundColor: '#fff',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{ ...baseStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ ...baseStyle, fontSize: '16px', fontWeight: 'bold', color: '#2c3e50', margin: 0, display: 'block' }}>
                {feedback.product_name}
              </div>
              <div style={{ 
                ...baseStyle, 
                padding: '4px 8px',
                backgroundColor: feedback.rating >= 4 ? '#e1f5e1' : feedback.rating === 3 ? '#fcf3cf' : '#fadbd8',
                color: feedback.rating >= 4 ? '#1e8449' : feedback.rating === 3 ? '#b7950b' : '#922b21',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '500',
                display: 'block'
              }}>
                {feedback.rating} ★ {feedback.rating_label}
              </div>
            </div>
            
            <div style={{ 
              ...baseStyle, 
              margin: '0 0 12px', 
              fontSize: '14px',
              color: '#555',
              lineHeight: '1.5',
              flex: '1',
              display: 'block'
            }}>
              {feedback.comment || 'No comment provided.'}
            </div>
            
            <div style={{ ...baseStyle, display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #eee', paddingTop: '12px' }}>
              <div style={{ ...baseStyle, fontSize: '14px', color: '#7f8c8d', display: 'block' }}>
                By: <span style={{ ...baseStyle, fontWeight: '500', display: 'inline' }}>{feedback.customer_name}</span>
              </div>
              <div style={{ ...baseStyle, fontSize: '14px', color: '#7f8c8d', display: 'block' }}>
                {new Date(feedback.created_at || feedback.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackCards;