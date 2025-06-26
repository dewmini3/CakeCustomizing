import React, { useState } from 'react';
import FeedbackReportDownloader from './FeedbackReportDownloader';

const FeedbackReport = ({ feedbacks }) => {
  const [reportType, setReportType] = useState('summary');
  
  // Calculate statistics
  const totalFeedbacks = feedbacks.length;
  const averageRating = totalFeedbacks > 0
    ? (feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0) / totalFeedbacks).toFixed(1)
    : 0;
  
  // Group by product
  const productGroups = feedbacks.reduce((acc, feedback) => {
    if (!acc[feedback.product_id]) {
      acc[feedback.product_id] = {
        product_name: feedback.product_name,
        count: 0,
        ratings: [],
        totalRating: 0
      };
    }
    
    acc[feedback.product_id].count++;
    acc[feedback.product_id].ratings.push(feedback.rating);
    acc[feedback.product_id].totalRating += feedback.rating;
    
    return acc;
  }, {});
  
  // Calculate average ratings per product
  Object.keys(productGroups).forEach(key => {
    productGroups[key].averageRating = (productGroups[key].totalRating / productGroups[key].count).toFixed(1);
  });
  
  // Sort products by average rating (descending)
  const sortedProducts = Object.values(productGroups).sort((a, b) => b.averageRating - a.averageRating);
  
  // Monthly trend data
  const monthlyData = feedbacks.reduce((acc, feedback) => {
    const date = new Date(feedback.created_at || feedback.createdAt);
    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
    
    if (!acc[monthYear]) {
      acc[monthYear] = {
        count: 0,
        totalRating: 0,
        month: date.toLocaleString('default', { month: 'short' }),
        year: date.getFullYear()
      };
    }
    
    acc[monthYear].count++;
    acc[monthYear].totalRating += feedback.rating;
    
    return acc;
  }, {});
  
  // Calculate monthly averages and sort by date
  const monthlyTrends = Object.entries(monthlyData)
    .map(([key, data]) => ({
      ...data,
      averageRating: (data.totalRating / data.count).toFixed(1),
      monthYear: key
    }))
    .sort((a, b) => {
      const [aMonth, aYear] = a.monthYear.split('/');
      const [bMonth, bYear] = b.monthYear.split('/');
      return new Date(bYear, bMonth - 1) - new Date(aYear, aMonth - 1);
    });

  // Recent feedbacks
  const recentFeedbacks = [...feedbacks]
    .sort((a, b) => new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt))
    .slice(0, 5);
    
  // Base style with all: unset to prevent inheritance
  const baseStyle = {
    all: 'unset',
    boxSizing: 'border-box',
    fontFamily: 'Arial, sans-serif'
  };
  
  const cardStyle = {
    ...baseStyle,
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.08)',
    padding: '24px',
    marginBottom: '24px',
    display: 'block',
    width: '100%'
  };

  return (
    <div style={{ ...baseStyle, display: 'block', width: '100%' }}>
      <div style={{ 
        ...cardStyle,
        marginBottom: '24px'
      }}>
        <div style={{ ...baseStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ ...baseStyle, fontSize: '20px', fontWeight: 'bold', color: '#2c3e50', margin: 0, display: 'block' }}>
            Feedback Analytics Report
          </div>
          
          <div style={{ ...baseStyle, display: 'block' }}>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              style={{
                ...baseStyle,
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                backgroundColor: '#fff'
              }}
            >
              <option value="summary">Summary Report</option>
              <option value="product">Product Report</option>
              <option value="trends">Trends Report</option>
            </select>
          </div>
        </div>
        
        {/* Summary Report */}
        {reportType === 'summary' && (
          <div style={{ ...baseStyle, display: 'block' }}>
            <div style={{ ...baseStyle, display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '24px' }}>
              <div style={{ 
                ...baseStyle, 
                flex: '1',
                minWidth: '200px',
                padding: '20px',
                borderRadius: '8px',
                backgroundColor: '#f9f9fa',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <div style={{ ...baseStyle, fontSize: '14px', color: '#7f8c8d', marginBottom: '8px', display: 'block' }}>Total Reviews</div>
                <div style={{ ...baseStyle, fontSize: '28px', fontWeight: 'bold', color: '#2c3e50', display: 'block' }}>{totalFeedbacks}</div>
              </div>
              
              <div style={{ 
                ...baseStyle, 
                flex: '1',
                minWidth: '200px',
                padding: '20px',
                borderRadius: '8px',
                backgroundColor: '#f9f9fa',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <div style={{ ...baseStyle, fontSize: '14px', color: '#7f8c8d', marginBottom: '8px', display: 'block' }}>Average Rating</div>
                <div style={{ ...baseStyle, fontSize: '28px', fontWeight: 'bold', color: '#2c3e50', display: 'block' }}>
                  {averageRating} <span style={{ ...baseStyle, fontSize: '18px', color: '#f39c12', display: 'inline' }}>★</span>
                </div>
              </div>
              
              <div style={{ 
                ...baseStyle, 
                flex: '1',
                minWidth: '200px',
                padding: '20px',
                borderRadius: '8px',
                backgroundColor: '#f9f9fa',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <div style={{ ...baseStyle, fontSize: '14px', color: '#7f8c8d', marginBottom: '8px', display: 'block' }}>Products Reviewed</div>
                <div style={{ ...baseStyle, fontSize: '28px', fontWeight: 'bold', color: '#2c3e50', display: 'block' }}>
                  {Object.keys(productGroups).length}
                </div>
              </div>
            </div>
            
            <div style={{ ...baseStyle, fontSize: '16px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '16px', display: 'block' }}>
              Top Rated Products
            </div>
            
            <div style={{ ...baseStyle, width: '100%', display: 'table', borderCollapse: 'collapse', marginBottom: '24px' }}>
              <div style={{ ...baseStyle, display: 'table-header-group' }}>
                <div style={{ ...baseStyle, display: 'table-row', backgroundColor: '#f8f9fa' }}>
                  <div style={{ ...baseStyle, display: 'table-cell', padding: '12px', textAlign: 'left', borderBottom: '1px solid #eee', fontSize: '14px', fontWeight: 'bold' }}>Product</div>
                  <div style={{ ...baseStyle, display: 'table-cell', padding: '12px', textAlign: 'center', borderBottom: '1px solid #eee', fontSize: '14px', fontWeight: 'bold' }}>Reviews</div>
                  <div style={{ ...baseStyle, display: 'table-cell', padding: '12px', textAlign: 'center', borderBottom: '1px solid #eee', fontSize: '14px', fontWeight: 'bold' }}>Average Rating</div>
                </div>
              </div>
              <div style={{ ...baseStyle, display: 'table-row-group' }}>
                {sortedProducts.slice(0, 5).map((product, index) => (
                  <div key={index} style={{ ...baseStyle, display: 'table-row' }}>
                    <div style={{ ...baseStyle, display: 'table-cell', padding: '12px', borderBottom: '1px solid #eee', fontSize: '14px' }}>{product.product_name}</div>
                    <div style={{ ...baseStyle, display: 'table-cell', padding: '12px', borderBottom: '1px solid #eee', fontSize: '14px', textAlign: 'center' }}>{product.count}</div>
                    <div style={{ ...baseStyle, display: 'table-cell', padding: '12px', borderBottom: '1px solid #eee', fontSize: '14px', textAlign: 'center' }}>
                      <div style={{ ...baseStyle, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <span style={{ ...baseStyle, marginRight: '4px', display: 'inline' }}>{product.averageRating}</span>
                        <span style={{ ...baseStyle, color: '#f39c12', display: 'inline' }}>★</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{ ...baseStyle, fontSize: '16px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '16px', display: 'block' }}>
              Recent Feedback
            </div>
            
            {recentFeedbacks.map((feedback, index) => (
              <div key={index} style={{ 
                ...baseStyle, 
                padding: '16px', 
                borderBottom: index < recentFeedbacks.length - 1 ? '1px solid #eee' : 'none',
                display: 'block'
              }}>
                <div style={{ ...baseStyle, display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ ...baseStyle, fontWeight: 'bold', fontSize: '15px', display: 'block' }}>{feedback.product_name}</div>
                  <div style={{ ...baseStyle, display: 'flex', alignItems: 'center' }}>
                    <span style={{ ...baseStyle, fontWeight: '600', fontSize: '14px', marginRight: '4px', display: 'inline' }}>{feedback.rating}</span>
                    <span style={{ ...baseStyle, color: '#f39c12', fontSize: '14px', display: 'inline' }}>★</span>
                    <span style={{ ...baseStyle, marginLeft: '8px', fontSize: '13px', color: '#7f8c8d', display: 'inline' }}>
                      {new Date(feedback.created_at || feedback.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div style={{ ...baseStyle, fontSize: '14px', color: '#555', display: 'block' }}>
                  <strong style={{ ...baseStyle, color: '#7f8c8d', display: 'inline' }}>{feedback.customer_name}: </strong>
                  {feedback.comment || <em style={{ ...baseStyle, color: '#999', fontStyle: 'italic', display: 'inline' }}>No comment</em>}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Product Report */}
        {reportType === 'product' && (
          <div style={{ ...baseStyle, display: 'block' }}>
            <div style={{ ...baseStyle, fontSize: '16px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '16px', display: 'block' }}>
              Product Performance
            </div>
            
            <div style={{ ...baseStyle, width: '100%', display: 'table', borderCollapse: 'collapse', marginBottom: '24px' }}>
              <div style={{ ...baseStyle, display: 'table-header-group' }}>
                <div style={{ ...baseStyle, display: 'table-row', backgroundColor: '#f8f9fa' }}>
                  <div style={{ ...baseStyle, display: 'table-cell', padding: '12px', textAlign: 'left', borderBottom: '1px solid #eee', fontSize: '14px', fontWeight: 'bold' }}>Product</div>
                  <div style={{ ...baseStyle, display: 'table-cell', padding: '12px', textAlign: 'center', borderBottom: '1px solid #eee', fontSize: '14px', fontWeight: 'bold' }}>Reviews</div>
                  <div style={{ ...baseStyle, display: 'table-cell', padding: '12px', textAlign: 'center', borderBottom: '1px solid #eee', fontSize: '14px', fontWeight: 'bold' }}>Average Rating</div>
                  <div style={{ ...baseStyle, display: 'table-cell', padding: '12px', textAlign: 'center', borderBottom: '1px solid #eee', fontSize: '14px', fontWeight: 'bold' }}>Rating Distribution</div>
                </div>
              </div>
              <div style={{ ...baseStyle, display: 'table-row-group' }}>
                {sortedProducts.map((product, index) => (
                  <div key={index} style={{ ...baseStyle, display: 'table-row' }}>
                    <div style={{ ...baseStyle, display: 'table-cell', padding: '12px', borderBottom: '1px solid #eee', fontSize: '14px' }}>{product.product_name}</div>
                    <div style={{ ...baseStyle, display: 'table-cell', padding: '12px', borderBottom: '1px solid #eee', fontSize: '14px', textAlign: 'center' }}>{product.count}</div>
                    <div style={{ ...baseStyle, display: 'table-cell', padding: '12px', borderBottom: '1px solid #eee', fontSize: '14px', textAlign: 'center' }}>
                      <div style={{ ...baseStyle, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <span style={{ ...baseStyle, marginRight: '4px', display: 'inline' }}>{product.averageRating}</span>
                        <span style={{ ...baseStyle, color: '#f39c12', display: 'inline' }}>★</span>
                      </div>
                    </div>
                    <div style={{ ...baseStyle, display: 'table-cell', padding: '12px', borderBottom: '1px solid #eee', fontSize: '14px' }}>
                      <div style={{ ...baseStyle, display: 'flex', height: '20px', width: '100%', borderRadius: '10px', overflow: 'hidden' }}>
                        {[5, 4, 3, 2, 1].map(rating => {
                          const count = product.ratings.filter(r => r === rating).length;
                          const percentage = (count / product.count) * 100;
                          
                          return percentage > 0 ? (
                            <div 
                              key={rating}
                              style={{
                                ...baseStyle,
                                height: '100%',
                                width: `${percentage}%`,
                                backgroundColor: 
                                  rating === 5 ? '#27ae60' :
                                  rating === 4 ? '#2ecc71' :
                                  rating === 3 ? '#f39c12' :
                                  rating === 2 ? '#e67e22' : '#e74c3c',
                                display: 'block'
                              }}
                              title={`${rating}★: ${count} (${percentage.toFixed(0)}%)`}
                            ></div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Trends Report */}
        {reportType === 'trends' && (
          <div style={{ ...baseStyle, display: 'block' }}>
            <div style={{ ...baseStyle, fontSize: '16px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '16px', display: 'block' }}>
              Monthly Feedback Trends
            </div>
            
            {/* Simple graph visualization */}
            <div style={{ ...baseStyle, marginBottom: '24px', padding: '20px', backgroundColor: '#f9f9fa', borderRadius: '8px', display: 'block' }}>
              <div style={{ ...baseStyle, height: '200px', display: 'flex', alignItems: 'flex-end', gap: '12px', justifyContent: 'space-around' }}>
                {monthlyTrends.slice(0, 6).reverse().map((month, index) => (
                  <div key={index} style={{ ...baseStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '1' }}>
                    <div style={{
                      ...baseStyle,
                      width: '100%',
                      maxWidth: '40px',
                      height: `${month.count * 15 > 180 ? 180 : month.count * 15}px`,
                      minHeight: '20px',
                      backgroundColor: '#3498db',
                      borderRadius: '4px 4px 0 0',
                      position: 'relative',
                      display: 'block'
                    }}>
                      <div style={{
                        ...baseStyle,
                        position: 'absolute',
                        top: '-25px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        color: '#2c3e50',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        display: 'block'
                      }}>
                        {month.count}
                      </div>
                    </div>
                    <div style={{ ...baseStyle, marginTop: '8px', fontSize: '12px', textAlign: 'center', display: 'block' }}>
                      {month.month}<br />{month.year}
                    </div>
                    <div style={{ ...baseStyle, fontSize: '12px', color: '#7f8c8d', display: 'flex', alignItems: 'center' }}>
                      <span style={{ ...baseStyle, display: 'inline' }}>{month.averageRating}</span>
                      <span style={{ ...baseStyle, color: '#f39c12', marginLeft: '2px', display: 'inline' }}>★</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{ ...baseStyle, fontSize: '16px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '16px', display: 'block' }}>
              Monthly Data
            </div>
            
            <div style={{ ...baseStyle, width: '100%', display: 'table', borderCollapse: 'collapse', marginBottom: '24px' }}>
              <div style={{ ...baseStyle, display: 'table-header-group' }}>
                <div style={{ ...baseStyle, display: 'table-row', backgroundColor: '#f8f9fa' }}>
                  <div style={{ ...baseStyle, display: 'table-cell', padding: '12px', textAlign: 'left', borderBottom: '1px solid #eee', fontSize: '14px', fontWeight: 'bold' }}>Month</div>
                  <div style={{ ...baseStyle, display: 'table-cell', padding: '12px', textAlign: 'center', borderBottom: '1px solid #eee', fontSize: '14px', fontWeight: 'bold' }}>Reviews</div>
                  <div style={{ ...baseStyle, display: 'table-cell', padding: '12px', textAlign: 'center', borderBottom: '1px solid #eee', fontSize: '14px', fontWeight: 'bold' }}>Average Rating</div>
                </div>
              </div>
              <div style={{ ...baseStyle, display: 'table-row-group' }}>
                {monthlyTrends.map((month, index) => (
                  <div key={index} style={{ ...baseStyle, display: 'table-row' }}>
                    <div style={{ ...baseStyle, display: 'table-cell', padding: '12px', borderBottom: '1px solid #eee', fontSize: '14px' }}>
                      {month.month} {month.year}
                    </div>
                    <div style={{ ...baseStyle, display: 'table-cell', padding: '12px', borderBottom: '1px solid #eee', fontSize: '14px', textAlign: 'center' }}>
                      {month.count}
                    </div>
                    <div style={{ ...baseStyle, display: 'table-cell', padding: '12px', borderBottom: '1px solid #eee', fontSize: '14px', textAlign: 'center' }}>
                      <div style={{ ...baseStyle, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <span style={{ ...baseStyle, marginRight: '4px', display: 'inline' }}>{month.averageRating}</span>
                        <span style={{ ...baseStyle, color: '#f39c12', display: 'inline' }}>★</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <FeedbackReportDownloader feedbacks={feedbacks} />
    </div>
  );
};

export default FeedbackReport;