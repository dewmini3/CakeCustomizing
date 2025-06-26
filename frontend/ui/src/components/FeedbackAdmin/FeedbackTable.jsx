import React, { useState } from 'react';

const FeedbackTable = ({ feedbacks, onDelete, onUpdate }) => {
  const [editingId, setEditingId] = useState(null);
  const [updatedComment, setUpdatedComment] = useState('');
  const [updatedRating, setUpdatedRating] = useState(1);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [selectedItems, setSelectedItems] = useState([]);
  
  const handleEdit = (feedback) => {
    setEditingId(feedback._id);
    setUpdatedComment(feedback.comment || '');
    setUpdatedRating(feedback.rating);
  };

  const handleUpdate = () => {
    const ratingLabels = {
      1: 'Poor',
      2: 'Fair',
      3: 'Good',
      4: 'Very Good',
      5: 'Excellent'
    };
    
    onUpdate(editingId, { 
      comment: updatedComment,
      rating: updatedRating,
      rating_label: ratingLabels[updatedRating]
    });
    setEditingId(null);
    setUpdatedComment('');
    setUpdatedRating(1);
  };
  
  const handleCancel = () => {
    setEditingId(null);
    setUpdatedComment('');
    setUpdatedRating(1);
  };
  
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  const sortedFeedbacks = [...feedbacks].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
  
  const handleSelectFeedback = (feedback) => {
    setSelectedFeedback(feedback);
  };
  
  const handleCheckboxChange = (feedbackId) => {
    if (selectedItems.includes(feedbackId)) {
      setSelectedItems(selectedItems.filter(id => id !== feedbackId));
    } else {
      setSelectedItems([...selectedItems, feedbackId]);
    }
  };
  
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(feedbacks.map(f => f._id));
    } else {
      setSelectedItems([]);
    }
  };
  
  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedItems.length} selected feedbacks?`)) {
      selectedItems.forEach(id => onDelete(id));
      setSelectedItems([]);
    }
  };

  // Base style with all: unset to prevent inheritance
  const baseStyle = {
    all: 'unset',
    boxSizing: 'border-box',
    fontFamily: 'Arial, sans-serif'
  };

  return (
    <div style={{ ...baseStyle, marginBottom: '32px', display: 'block', width: '100%' }}>
      <div style={{ 
        ...baseStyle, 
        backgroundColor: '#fff', 
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        display: 'block',
        width: '100%'
      }}>
        {/* Table Header Actions */}
        <div style={{ 
          ...baseStyle, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '16px',
          borderBottom: '1px solid #eee',
          width: '100%'
        }}>
          <div style={{ ...baseStyle, fontSize: '18px', fontWeight: 'bold', color: '#2c3e50', margin: 0, display: 'block' }}>
            Customer Feedback
          </div>
          
          <div style={{ ...baseStyle, display: 'flex', gap: '12px' }}>
            {selectedItems.length > 0 && (
              <button
                onClick={handleBulkDelete}
                style={{
                  ...baseStyle,
                  padding: '8px 16px',
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  display: 'inline-block'
                }}
              >
                Delete Selected ({selectedItems.length})
              </button>
            )}
            
           
          </div>
        </div>
        
        {/* Custom Table Implementation */}
        <div style={{ ...baseStyle, overflowX: 'auto', width: '100%', display: 'block' }}>
          <div style={{ ...baseStyle, width: '100%', display: 'table', borderCollapse: 'collapse' }}>
            {/* Table Header */}
            <div style={{ ...baseStyle, display: 'table-header-group' }}>
              <div style={{ ...baseStyle, display: 'table-row' }}>
                <div style={{ 
                  ...baseStyle, 
                  display: 'table-cell', 
                  padding: '12px', 
                  borderBottom: '2px solid #ddd', 
                  backgroundColor: '#f8f9fa',
                  color: '#2c3e50',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  textAlign: 'center',
                  verticalAlign: 'middle',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}>
                  <input 
                    type="checkbox" 
                    checked={selectedItems.length === feedbacks.length && feedbacks.length > 0}
                    onChange={handleSelectAll}
                    style={{ ...baseStyle, cursor: 'pointer' }}
                  />
                </div>
                
                <div 
                  onClick={() => handleSort('customer_name')}
                  style={{ 
                    ...baseStyle, 
                    display: 'table-cell', 
                    padding: '12px', 
                    borderBottom: '2px solid #ddd', 
                    backgroundColor: '#f8f9fa',
                    color: '#2c3e50',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    textAlign: 'left',
                    verticalAlign: 'middle',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                >
                  Customer
                  {sortConfig.key === 'customer_name' && (
                    <span style={{ ...baseStyle }}>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                  )}
                </div>
                
                <div 
                  onClick={() => handleSort('product_name')}
                  style={{ 
                    ...baseStyle, 
                    display: 'table-cell', 
                    padding: '12px', 
                    borderBottom: '2px solid #ddd', 
                    backgroundColor: '#f8f9fa',
                    color: '#2c3e50',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    textAlign: 'left',
                    verticalAlign: 'middle',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                >
                  Product
                  {sortConfig.key === 'product_name' && (
                    <span style={{ ...baseStyle }}>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                  )}
                </div>
                
                <div 
                  onClick={() => handleSort('rating')}
                  style={{ 
                    ...baseStyle, 
                    display: 'table-cell', 
                    padding: '12px', 
                    borderBottom: '2px solid #ddd', 
                    backgroundColor: '#f8f9fa',
                    color: '#2c3e50',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    textAlign: 'left',
                    verticalAlign: 'middle',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                >
                  Rating
                  {sortConfig.key === 'rating' && (
                    <span style={{ ...baseStyle }}>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                  )}
                </div>
                
                <div 
                  onClick={() => handleSort('comment')}
                  style={{ 
                    ...baseStyle, 
                    display: 'table-cell', 
                    padding: '12px', 
                    borderBottom: '2px solid #ddd', 
                    backgroundColor: '#f8f9fa',
                    color: '#2c3e50',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    textAlign: 'left',
                    verticalAlign: 'middle',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                >
                  Comment
                  {sortConfig.key === 'comment' && (
                    <span style={{ ...baseStyle }}>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                  )}
                </div>
                
                <div 
                  onClick={() => handleSort('createdAt')}
                  style={{ 
                    ...baseStyle, 
                    display: 'table-cell', 
                    padding: '12px', 
                    borderBottom: '2px solid #ddd', 
                    backgroundColor: '#f8f9fa',
                    color: '#2c3e50',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    textAlign: 'left',
                    verticalAlign: 'middle',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                >
                  Date
                  {sortConfig.key === 'createdAt' && (
                    <span style={{ ...baseStyle }}>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                  )}
                </div>
                
                <div style={{ 
                  ...baseStyle, 
                  display: 'table-cell', 
                  padding: '12px', 
                  borderBottom: '2px solid #ddd', 
                  backgroundColor: '#f8f9fa',
                  color: '#2c3e50',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  textAlign: 'left',
                  verticalAlign: 'middle'
                }}>
                  Actions
                </div>
              </div>
            </div>
            
            {/* Table Body */}
            <div style={{ ...baseStyle, display: 'table-row-group' }}>
              {sortedFeedbacks.length > 0 ? (
                sortedFeedbacks.map((feedback) => (
                  <div 
                    key={feedback._id} 
                    style={{ 
                      ...baseStyle, 
                      display: 'table-row',
                      backgroundColor: selectedItems.includes(feedback._id) ? '#f2f9ff' : 'transparent',
                      transition: 'background-color 0.2s'
                    }}
                    onClick={() => handleSelectFeedback(feedback)}
                  >
                    <div style={{ 
                      ...baseStyle, 
                      display: 'table-cell', 
                      padding: '12px', 
                      borderBottom: '1px solid #eee',
                      textAlign: 'center',
                      verticalAlign: 'middle'
                    }}>
                      <input 
                        type="checkbox"
                        checked={selectedItems.includes(feedback._id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleCheckboxChange(feedback._id);
                        }}
                        style={{ ...baseStyle, cursor: 'pointer' }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    
                    <div style={{ 
                      ...baseStyle, 
                      display: 'table-cell', 
                      padding: '12px', 
                      borderBottom: '1px solid #eee',
                      verticalAlign: 'middle'
                    }}>
                      {feedback.customer_name}
                    </div>
                    
                    <div style={{ 
                      ...baseStyle, 
                      display: 'table-cell', 
                      padding: '12px', 
                      borderBottom: '1px solid #eee',
                      verticalAlign: 'middle'
                    }}>
                      {feedback.product_name}
                    </div>
                    
                    <div style={{ 
                      ...baseStyle, 
                      display: 'table-cell', 
                      padding: '12px', 
                      borderBottom: '1px solid #eee',
                      verticalAlign: 'middle'
                    }}>
                      {editingId === feedback._id ? (
                        <select
                          value={updatedRating}
                          onChange={(e) => setUpdatedRating(Number(e.target.value))}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            ...baseStyle,
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '14px',
                            backgroundColor: '#fff'
                          }}
                        >
                          <option value={5}>5 - Excellent</option>
                          <option value={4}>4 - Very Good</option>
                          <option value={3}>3 - Good</option>
                          <option value={2}>2 - Fair</option>
                          <option value={1}>1 - Poor</option>
                        </select>
                      ) : (
                        <div style={{ 
                          ...baseStyle, 
                          display: 'inline-flex', 
                          alignItems: 'center',
                          padding: '4px 8px',
                          backgroundColor: feedback.rating >= 4 ? '#e1f5e1' : feedback.rating === 3 ? '#fcf3cf' : '#fadbd8',
                          color: feedback.rating >= 4 ? '#1e8449' : feedback.rating === 3 ? '#b7950b' : '#922b21',
                          borderRadius: '4px',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}>
                          {feedback.rating}★ {feedback.rating_label}
                        </div>
                      )}
                    </div>
                    
                    <div style={{ 
                      ...baseStyle, 
                      display: 'table-cell', 
                      padding: '12px', 
                      borderBottom: '1px solid #eee',
                      verticalAlign: 'middle'
                    }}>
                      {editingId === feedback._id ? (
                        <textarea
                          value={updatedComment}
                          onChange={(e) => setUpdatedComment(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            ...baseStyle,
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            minHeight: '60px',
                            resize: 'vertical',
                            fontSize: '14px'
                          }}
                        />
                      ) : (
                        <div style={{ ...baseStyle, fontSize: '14px' }}>
                          {feedback.comment || <em style={{ ...baseStyle, fontStyle: 'italic', color: '#999' }}>No comment</em>}
                        </div>
                      )}
                    </div>
                    
                    <div style={{ 
                      ...baseStyle, 
                      display: 'table-cell', 
                      padding: '12px', 
                      borderBottom: '1px solid #eee',
                      whiteSpace: 'nowrap',
                      verticalAlign: 'middle'
                    }}>
                      {new Date(feedback.created_at || feedback.createdAt).toLocaleDateString()}
                    </div>
                    
                    <div style={{ 
                      ...baseStyle, 
                      display: 'table-cell', 
                      padding: '12px', 
                      borderBottom: '1px solid #eee',
                      whiteSpace: 'nowrap',
                      verticalAlign: 'middle'
                    }}>
                      {editingId === feedback._id ? (
                        <div style={{ ...baseStyle, display: 'flex', gap: '8px' }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdate();
                            }}
                            style={{
                              ...baseStyle,
                              padding: '6px 12px',
                              backgroundColor: '#27ae60',
                              color: 'white',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '14px'
                            }}
                          >
                            Save
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancel();
                            }}
                            style={{
                              ...baseStyle,
                              padding: '6px 12px',
                              backgroundColor: '#7f8c8d',
                              color: 'white',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '14px'
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div style={{ ...baseStyle, display: 'flex', gap: '8px' }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(feedback);
                            }}
                            style={{
                              ...baseStyle,
                              padding: '6px 12px',
                              backgroundColor: '#3498db',
                              color: 'white',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '14px'
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(feedback._id);
                            }}
                            style={{
                              ...baseStyle,
                              padding: '6px 12px',
                              backgroundColor: '#e74c3c',
                              color: 'white',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '14px'
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ ...baseStyle, display: 'table-row' }}>
                  <div 
                    colSpan="7" 
                    style={{ 
                      ...baseStyle, 
                      display: 'table-cell',
                      textAlign: 'center', 
                      padding: '24px', 
                      color: '#666',
                      borderBottom: '1px solid #eee'
                    }}
                  >
                    No feedback found.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Table Footer */}
        <div style={{ 
          ...baseStyle, 
          padding: '16px', 
          borderTop: '1px solid #eee', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <div style={{ ...baseStyle, fontSize: '14px', color: '#7f8c8d' }}>
            Showing {sortedFeedbacks.length} of {feedbacks.length} feedbacks
          </div>
          <div style={{ ...baseStyle, display: 'flex', gap: '8px' }}>
            <button style={{
              ...baseStyle,
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: '#fff',
              cursor: 'pointer',
              fontSize: '14px'
            }}>
              Previous
            </button>
            <button style={{
              ...baseStyle,
              padding: '8px 12px',
              backgroundColor: '#3498db',
              color: 'white',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}>
              1
            </button>
            <button style={{
              ...baseStyle,
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: '#fff',
              cursor: 'pointer',
              fontSize: '14px'
            }}>
              Next
            </button>
          </div>
        </div>
      </div>
      
      {/* Feedback Detail Modal */}
      {selectedFeedback && (
        <div 
          onClick={() => setSelectedFeedback(null)}
          style={{
            ...baseStyle,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              ...baseStyle,
              backgroundColor: '#fff',
              padding: '24px',
              borderRadius: '8px',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ ...baseStyle, fontSize: '20px', marginBottom: '16px', fontWeight: 'bold', display: 'block' }}>
              Feedback Details
            </div>
            
            <div style={{ ...baseStyle, marginBottom: '16px', display: 'block' }}>
              <div style={{ ...baseStyle, fontWeight: 'bold', marginBottom: '4px', fontSize: '14px', display: 'block' }}>Product</div>
              <div style={{ ...baseStyle, fontSize: '16px', display: 'block' }}>{selectedFeedback.product_name}</div>
            </div>
            
            <div style={{ ...baseStyle, marginBottom: '16px', display: 'block' }}>
              <div style={{ ...baseStyle, fontWeight: 'bold', marginBottom: '4px', fontSize: '14px', display: 'block' }}>Customer</div>
              <div style={{ ...baseStyle, fontSize: '16px', display: 'block' }}>{selectedFeedback.customer_name}</div>
            </div>
            
            <div style={{ ...baseStyle, marginBottom: '16px', display: 'block' }}>
              <div style={{ ...baseStyle, fontWeight: 'bold', marginBottom: '4px', fontSize: '14px', display: 'block' }}>Rating</div>
              <div style={{ ...baseStyle, fontSize: '16px', display: 'block' }}>
                {selectedFeedback.rating}★ ({selectedFeedback.rating_label})
              </div>
            </div>
            
            <div style={{ ...baseStyle, marginBottom: '16px', display: 'block' }}>
              <div style={{ ...baseStyle, fontWeight: 'bold', marginBottom: '4px', fontSize: '14px', display: 'block' }}>Comment</div>
              <div style={{ ...baseStyle, fontSize: '16px', display: 'block' }}>
                {selectedFeedback.comment || 'No comment provided.'}
              </div>
            </div>
            
            <div style={{ ...baseStyle, marginBottom: '16px', display: 'block' }}>
              <div style={{ ...baseStyle, fontWeight: 'bold', marginBottom: '4px', fontSize: '14px', display: 'block' }}>Date</div>
              <div style={{ ...baseStyle, fontSize: '16px', display: 'block' }}>
                {new Date(selectedFeedback.created_at || selectedFeedback.createdAt).toLocaleString()}
              </div>
            </div>
            
            <div style={{ ...baseStyle, display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <button
                onClick={() => {
                  handleEdit(selectedFeedback);
                  setSelectedFeedback(null);
                }}
                style={{
                  ...baseStyle,
                  padding: '8px 16px',
                  backgroundColor: '#3498db',
                  color: 'white',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  display: 'inline-block'
                }}
              >
                Edit
              </button>
              <button
                onClick={() => setSelectedFeedback(null)}
                style={{
                  ...baseStyle,
                  padding: '8px 16px',
                  backgroundColor: '#7f8c8d',
                  color: 'white',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  display: 'inline-block'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackTable;