import React, { useState } from 'react';

const FeedbackSearchFilter = ({ searchTerm, setSearchTerm, filterRating, setFilterRating }) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const handleAdvancedFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
  };

  // Common style objects with all: unset to prevent CSS conflicts
  const baseStyles = {
    all: 'unset',
    boxSizing: 'border-box',
    fontFamily: 'Arial, sans-serif'
  };

  const containerStyles = {
    ...baseStyles,
    display: 'block',
    padding: '16px',
    borderRadius: '8px',
    backgroundColor: '#f8f9fa',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    marginBottom: '24px'
  };

  return (
    <div style={containerStyles}>
      <div style={{ ...baseStyles, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ ...baseStyles, fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#2c3e50' }}>Search & Filter</h3>
        <button 
          onClick={handleAdvancedFilters}
          style={{
            ...baseStyles,
            padding: '8px 16px',
            backgroundColor: '#34495e',
            color: 'white',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'background-color 0.2s'
          }}
        >
          {showAdvancedFilters ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
        </button>
      </div>

      <div style={{ ...baseStyles, display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ ...baseStyles, flex: '3', minWidth: '250px' }}>
          <input
            type="text"
            placeholder="Search by customer name, product, comment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              ...baseStyles,
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              backgroundColor: '#fff'
            }}
          />
        </div>

        <div style={{ ...baseStyles, flex: '1', minWidth: '150px' }}>
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            style={{
              ...baseStyles,
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              backgroundColor: '#fff',
              appearance: 'auto'
            }}
          >
            <option value="all">All Ratings</option>
            <option value="5">★★★★★ Excellent</option>
            <option value="4">★★★★☆ Very Good</option>
            <option value="3">★★★☆☆ Good</option>
            <option value="2">★★☆☆☆ Fair</option>
            <option value="1">★☆☆☆☆ Poor</option>
          </select>
        </div>
      </div>

      {showAdvancedFilters && (
        <div style={{ 
          ...baseStyles, 
          marginTop: '16px', 
          padding: '16px', 
          borderTop: '1px solid #ddd',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px' 
        }}>
          <div style={{ ...baseStyles, flex: '1', minWidth: '200px' }}>
            <label style={{ ...baseStyles, display: 'block', marginBottom: '8px', fontSize: '14px', color: '#555' }}>
              From Date:
            </label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              style={{
                ...baseStyles,
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                backgroundColor: '#fff'
              }}
            />
          </div>
          
          <div style={{ ...baseStyles, flex: '1', minWidth: '200px' }}>
            <label style={{ ...baseStyles, display: 'block', marginBottom: '8px', fontSize: '14px', color: '#555' }}>
              To Date:
            </label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              style={{
                ...baseStyles,
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                backgroundColor: '#fff'
              }}
            />
          </div>
          
          <div style={{ ...baseStyles, flex: '1', minWidth: '200px' }}>
            <label style={{ ...baseStyles, display: 'block', marginBottom: '8px', fontSize: '14px', color: '#555' }}>
              Sort By:
            </label>
            <select
              style={{
                ...baseStyles,
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                backgroundColor: '#fff',
                appearance: 'auto'
              }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackSearchFilter;