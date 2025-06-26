import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FeedbackTable from './FeedbackTable';
import FeedbackSearchFilter from './FeedbackSearchFilter';
import FeedbackReport from './FeedbackReport';
import FeedbackCards from './FeedbackCards';

const FeedbackAdminPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('all');

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/feedback');
        setFeedbacks(response.data);
        setFilteredFeedbacks(response.data);
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
      }
    };

    fetchFeedbacks();
  }, []);

  useEffect(() => {
    let result = feedbacks;

    // Filter by rating
    if (filterRating !== 'all') {
      const ratingValue = parseInt(filterRating);
      result = result.filter((feedback) => feedback.rating === ratingValue);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (feedback) =>
          feedback.customer_name.toLowerCase().includes(term) ||
          feedback.product_name.toLowerCase().includes(term) ||
          feedback.rating_label.toLowerCase().includes(term) ||
          (feedback.comment && feedback.comment.toLowerCase().includes(term))
      );
    }

    setFilteredFeedbacks(result);
  }, [searchTerm, filterRating, feedbacks]);

  const handleDeleteFeedback = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/feedback/${id}`);
      setFeedbacks(feedbacks.filter((feedback) => feedback._id !== id));
    } catch (error) {
      console.error('Error deleting feedback:', error);
    }
  };

  const handleUpdateFeedback = async (id, updatedData) => {
    try {
      const response = await axios.patch(`http://localhost:4000/api/feedback/${id}`, updatedData);
      setFeedbacks(feedbacks.map((feedback) => (feedback._id === id ? response.data : feedback)));
    } catch (error) {
      console.error('Error updating feedback:', error);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Feedback Management</h1>
      <FeedbackSearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterRating={filterRating}
        setFilterRating={setFilterRating}
      />
      <FeedbackCards feedbacks={filteredFeedbacks} />
      <FeedbackTable feedbacks={filteredFeedbacks} onDelete={handleDeleteFeedback} onUpdate={handleUpdateFeedback} />
      <FeedbackReport feedbacks={filteredFeedbacks} />
    </div>
  );
};

export default FeedbackAdminPage;