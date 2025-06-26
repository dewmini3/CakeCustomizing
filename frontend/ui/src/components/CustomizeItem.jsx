import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const CustomizeItem = () => {
  const [customizeData, setCustomizeData] = useState({
    custom_layers: 2, // Default to 2 layers
    custom_size: '',
    custom_shape: '',
    custom_bases: [], // Array to store multiple bases
    custom_filling: '',
    custom_frosting: '',
    custom_decorations: '',
    custom_price: 0,
    custom_specifications: '',
    ingredients: []
  });

  const [availableOptions, setAvailableOptions] = useState({
    cake_base: [],
    filling: [],
    frosting: [],
    decorations: []
  });

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Clear error message after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Initialize custom_bases array when custom_layers changes
  useEffect(() => {
    setCustomizeData(prev => ({
      ...prev,
      custom_bases: Array(prev.custom_layers).fill('')
    }));
  }, [customizeData.custom_layers]);

  // Fetch available options when size or shape changes
  useEffect(() => {
    if (customizeData.custom_size && customizeData.custom_shape) {
      fetchAvailableOptions();
    }
  }, [customizeData.custom_size, customizeData.custom_shape]);

  const fetchAvailableOptions = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/customize/available-options?size=${customizeData.custom_size}&shape=${customizeData.custom_shape}`
      );
      if (response.data.status === 'Success') {
        setAvailableOptions(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch available options');
      }
    } catch (err) {
      setError('Failed to fetch available options: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'custom_layers') {
      const layers = parseInt(value);
      if (layers < 2) {
        setError('Number of layers must be at least 2');
        return;
      }
      setCustomizeData(prev => ({
        ...prev,
        [name]: layers,
        custom_bases: Array(layers).fill('')
      }));
    } else {
      setCustomizeData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // If changing size or shape, reset selections
    if (name === 'custom_size' || name === 'custom_shape') {
      setCustomizeData(prev => ({
        ...prev,
        custom_bases: Array(prev.custom_layers).fill(''),
        custom_filling: '',
        custom_frosting: '',
        custom_decorations: '',
        custom_price: 0,
        ingredients: []
      }));
    }
  };

  const handleBaseSelect = (layerIndex, optionId) => {
    const option = availableOptions.cake_base.find(opt => opt._id === optionId);
    if (!option) return;

    setCustomizeData(prev => {
      const newBases = [...prev.custom_bases];
      newBases[layerIndex] = optionId;
      
      // Update price and ingredients
      let totalPrice = 0;
      let allIngredients = [];

      // Add prices and ingredients from all bases
      newBases.forEach(baseId => {
        if (baseId) {
          const selectedBase = availableOptions.cake_base.find(opt => opt._id === baseId);
          if (selectedBase) {
            totalPrice += selectedBase.option_price;
            allIngredients = [...allIngredients, ...selectedBase.ingredients];
          }
        }
      });

      // Add prices and ingredients from other selected options
      ['filling', 'frosting', 'decorations'].forEach(optType => {
        if (prev[`custom_${optType}`]) {
          const selectedOpt = availableOptions[optType].find(opt => opt._id === prev[`custom_${optType}`]);
          if (selectedOpt) {
            totalPrice += selectedOpt.option_price;
            allIngredients = [...allIngredients, ...selectedOpt.ingredients];
          }
        }
      });

      return {
        ...prev,
        custom_bases: newBases,
        custom_price: totalPrice,
        ingredients: allIngredients
      };
    });
  };

  const validateForm = () => {
    if (!customizeData.custom_size || !customizeData.custom_shape || 
        !customizeData.custom_filling || !customizeData.custom_frosting || 
        !customizeData.custom_decorations) {
      setError('Please fill in all required fields');
      return false;
    }

    if (customizeData.custom_layers < 2) {
      setError('Number of layers must be at least 2');
      return false;
    }

    if (customizeData.custom_bases.some(base => !base)) {
      setError('Please select a base for each layer');
      return false;
    }

    if (!['6', '8', '10', '12'].includes(customizeData.custom_size)) {
      setError('Invalid size. Must be one of: 6, 8, 10, 12');
      return false;
    }

    if (!['round', 'square', 'heart'].includes(customizeData.custom_shape.toLowerCase())) {
      setError('Invalid shape. Must be one of: round, square, heart');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/api/customize/add', customizeData);
      
      if (response.data.status === 'Success') {
        setSuccess('Customize added successfully!');
        setCustomizeData({
          custom_layers: 2,
          custom_size: '',
          custom_shape: '',
          custom_bases: [],
          custom_filling: '',
          custom_frosting: '',
          custom_decorations: '',
          custom_price: 0,
          custom_specifications: '',
          ingredients: []
        });
      } else {
        setError(response.data.message || 'Failed to add customize');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add customize');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <h2>Customize Item</h2>
        </Col>
        <Col xs="auto">
          <Link to="/update-customize">
            <Button variant="secondary">Go Back</Button>
          </Link>
        </Col>
      </Row>
      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Number of Layers (Minimum 2)</Form.Label>
              <Form.Control
                type="number"
                name="custom_layers"
                value={customizeData.custom_layers}
                onChange={handleChange}
                min="2"
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Size</Form.Label>
              <Form.Select
                name="custom_size"
                value={customizeData.custom_size}
                onChange={handleChange}
                required
              >
                <option value="">Select Size</option>
                <option value="6">6 inch</option>
                <option value="8">8 inch</option>
                <option value="10">10 inch</option>
                <option value="12">12 inch</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Shape</Form.Label>
              <Form.Select
                name="custom_shape"
                value={customizeData.custom_shape}
                onChange={handleChange}
                required
              >
                <option value="">Select Shape</option>
                <option value="round">Round</option>
                <option value="square">Square</option>
                <option value="heart">Heart</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {/* Dynamic Base Selection for each layer */}
        {customizeData.custom_bases.map((base, index) => (
          <Row key={index} className="mb-3">
            <Col>
              <Form.Group>
                <Form.Label>Layer {index + 1} Base</Form.Label>
                <Form.Select
                  value={base}
                  onChange={(e) => handleBaseSelect(index, e.target.value)}
                  required
                >
                  <option value="">Select Base for Layer {index + 1}</option>
                  {availableOptions.cake_base.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.option_name} - ${option.option_price}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        ))}

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Filling</Form.Label>
              <Form.Select
                name="custom_filling"
                value={customizeData.custom_filling}
                onChange={handleChange}
                required
              >
                <option value="">Select Filling</option>
                {availableOptions.filling.map((option) => (
                  <option key={option._id} value={option._id}>
                    {option.option_name} - ${option.option_price}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Frosting</Form.Label>
              <Form.Select
                name="custom_frosting"
                value={customizeData.custom_frosting}
                onChange={handleChange}
                required
              >
                <option value="">Select Frosting</option>
                {availableOptions.frosting.map((option) => (
                  <option key={option._id} value={option._id}>
                    {option.option_name} - ${option.option_price}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Decorations</Form.Label>
              <Form.Select
                name="custom_decorations"
                value={customizeData.custom_decorations}
                onChange={handleChange}
                required
              >
                <option value="">Select Decorations</option>
                {availableOptions.decorations.map((option) => (
                  <option key={option._id} value={option._id}>
                    {option.option_name} - ${option.option_price}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Special Instructions</Form.Label>
              <Form.Control
                as="textarea"
                name="custom_specifications"
                value={customizeData.custom_specifications}
                onChange={handleChange}
                rows={3}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <h4>Total Price: ${customizeData.custom_price.toFixed(2)}</h4>
          </Col>
        </Row>

        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Customization'}
        </Button>
      </Form>
    </Container>
  );
};

export default CustomizeItem; 