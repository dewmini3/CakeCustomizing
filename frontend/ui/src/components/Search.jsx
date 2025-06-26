import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import './Search.css';

const Search = () => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const query = searchParams.get('q') || '';

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        // Correct fetch URL
        const response = await fetch('http://localhost:4000/api/product/search?q=' + encodeURIComponent(query));
        const data = await response.json();

        // The backend returns { status, products }
        setResults(data.products || []);
      } catch (error) {
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchResults();
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [query]);

  if (!query) {
    return (
      <div className="search-results-container">
        <h2>Please enter a search term</h2>
      </div>
    );
  }

  return (
    <div className="search-results-container">
      <h2>Search Results for "{query}"</h2>
      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : results.length > 0 ? (
        <div className="search-results-grid">
          {results.map((product) => (
            <div key={product._id} className="search-result-card">
              <Link to={`/cake/${product._id}`} className="cake-link">
                <img src={product.product_image || product.image} alt={product.product_name} className="cake-image" />
                <div className="cake-details">
                  <h3>{product.product_name}</h3>
                  <p className="cake-price">${product.product_price}</p>
                  <p className="cake-description">{product.product_description}</p>
                  <button className="view-details-btn">View Details</button>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-results">
          <p>No results found for "{query}"</p>
          <p>Try different keywords or browse our categories</p>
        </div>
      )}
    </div>
  );
};

export default Search; 