import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Alert, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Customize = () => {
  const [customData, setCustomData] = useState({
    custom_layers: 1,
    custom_size: '',
    custom_shape: '',
    custom_bases: [{ _id: '' }],
    custom_filling: { _id: '' },
    custom_frosting: { _id: '' },
    custom_decorations: [{ _id: '' }]
  });

  const [availableOptions, setAvailableOptions] = useState({
    bases: [],
    fillings: [],
    frostings: [],
    decorations: []
  });

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

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

  // Fetch available options on component mount
  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/option');
      const options = response.data;
      
      // Filter options based on option_name and ensure they have valid pricing for the selected shape
      const bases = options.filter(opt => 
        opt.option_name.toLowerCase() === 'cake base' && 
        opt.option_pricing && 
        opt.option_pricing.length > 0
      );
      
      const fillings = options.filter(opt => 
        opt.option_name.toLowerCase() === 'filling' && 
        opt.option_pricing && 
        opt.option_pricing.length > 0
      );
      
      const frostings = options.filter(opt => 
        opt.option_name.toLowerCase() === 'frosting' && 
        opt.option_pricing && 
        opt.option_pricing.length > 0
      );
      
      const decorations = options.filter(opt => 
        opt.option_name.toLowerCase() === 'decorations' && 
        opt.option_pricing && 
        opt.option_pricing.length > 0
      );
      
      setAvailableOptions({
        bases,
        fillings,
        frostings,
        decorations
      });
    } catch (err) {
      console.error('Error fetching options:', err);
      setError('Failed to fetch options');
    }
  };

  // Update getFilteredOptions to filter by size and shape
  const getFilteredOptions = (options, size) => {
    return options.filter(opt => 
      opt.option_size === size && 
      opt.option_pricing?.some(p => p.shape === customData.custom_shape)
    );
  };

  // Add useEffect to refilter options when size or shape changes
  useEffect(() => {
    if (customData.custom_size && customData.custom_shape) {
      const filteredOptions = {
        bases: getFilteredOptions(availableOptions.bases, customData.custom_size),
        fillings: getFilteredOptions(availableOptions.fillings, customData.custom_size),
        frostings: getFilteredOptions(availableOptions.frostings, customData.custom_size),
        decorations: getFilteredOptions(availableOptions.decorations, customData.custom_size)
      };
      setAvailableOptions(filteredOptions);
    }
  }, [customData.custom_size, customData.custom_shape]);

  const handleLayersChange = (e) => {
    const layers = parseInt(e.target.value);
    setCustomData(prev => ({
      ...prev,
      custom_layers: layers,
      custom_bases: Array(layers).fill().map((_, i) => 
        prev.custom_bases[i] || { _id: '' }
      )
    }));
  };

  const handleSizeChange = (e) => {
    setCustomData(prev => ({
      ...prev,
      custom_size: e.target.value
    }));
  };

  const handleShapeChange = (e) => {
    setCustomData(prev => ({
      ...prev,
      custom_shape: e.target.value
    }));
  };

  const handleBaseChange = (index, value) => {
    const selectedBase = availableOptions.bases.find(opt => opt.option_flavor === value);
    if (!selectedBase) return;

    const newBases = [...customData.custom_bases];
    newBases[index] = {
      _id: selectedBase._id,
      option_name: 'cake base',
      option_flavor: selectedBase.option_flavor,
      option_size: customData.custom_size,
      shape: customData.custom_shape,
      price: selectedBase.option_pricing?.find(p => p.shape === customData.custom_shape)?.price || 0,
      ingredients: selectedBase.ingredients || []
    };
    setCustomData(prev => ({
      ...prev,
      custom_bases: newBases
    }));
  };

  const handleFillingChange = (value) => {
    const selectedFilling = availableOptions.fillings.find(opt => opt.option_flavor === value);
    if (!selectedFilling) return;

    setCustomData(prev => ({
      ...prev,
      custom_filling: {
        _id: selectedFilling._id,
        option_name: 'filling',
        option_flavor: selectedFilling.option_flavor,
        option_size: customData.custom_size,
        shape: customData.custom_shape,
        price: selectedFilling.option_pricing?.find(p => p.shape === customData.custom_shape)?.price || 0,
        ingredients: selectedFilling.ingredients || []
      }
    }));
  };

  const handleFrostingChange = (value) => {
    const selectedFrosting = availableOptions.frostings.find(opt => opt.option_flavor === value);
    if (!selectedFrosting) return;

    setCustomData(prev => ({
      ...prev,
      custom_frosting: {
        _id: selectedFrosting._id,
        option_name: 'frosting',
        option_flavor: selectedFrosting.option_flavor,
        option_size: customData.custom_size,
        shape: customData.custom_shape,
        price: selectedFrosting.option_pricing?.find(p => p.shape === customData.custom_shape)?.price || 0,
        ingredients: selectedFrosting.ingredients || []
      }
    }));
  };

  const handleDecorationChange = (index, value) => {
    const selectedDecoration = availableOptions.decorations.find(opt => opt.option_flavor === value);
    if (!selectedDecoration) return;

    const newDecorations = [...customData.custom_decorations];
    newDecorations[index] = {
      _id: selectedDecoration._id,
      option_name: 'decorations',
      option_flavor: selectedDecoration.option_flavor,
      option_size: customData.custom_size,
      shape: customData.custom_shape,
      price: selectedDecoration.option_pricing?.find(p => p.shape === customData.custom_shape)?.price || 0,
      ingredients: selectedDecoration.ingredients || []
    };
    setCustomData(prev => ({
      ...prev,
      custom_decorations: newDecorations
    }));
  };

  const addDecoration = () => {
    setCustomData(prev => ({
      ...prev,
      custom_decorations: [...prev.custom_decorations, { _id: '' }]
    }));
  };

  const removeDecoration = (index) => {
    setCustomData(prev => ({
      ...prev,
      custom_decorations: prev.custom_decorations.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate required fields
      if (!customData.custom_bases.every(base => base._id)) {
        throw new Error('Please select all cake bases');
      }
      if (!customData.custom_filling._id) {
        throw new Error('Please select a filling');
      }
      if (!customData.custom_frosting._id) {
        throw new Error('Please select a frosting');
      }
      if (!customData.custom_decorations.every(dec => dec._id)) {
        throw new Error('Please select all decorations');
      }

      const submissionData = {
        custom_layers: parseInt(customData.custom_layers),
        custom_bases: customData.custom_bases,
        custom_filling: customData.custom_filling,
        custom_frosting: customData.custom_frosting,
        custom_decorations: customData.custom_decorations
      };

      console.log('Submitting data:', submissionData);
      const response = await axios.post('http://localhost:4000/api/customize/add', submissionData);
      console.log('Response:', response.data);
      
      if (response.data) {
        setSuccess('Customization saved successfully!');
        // Reset form
        setCustomData({
          custom_layers: 1,
          custom_size: '',
          custom_shape: '',
          custom_bases: [{ _id: '' }],
          custom_filling: { _id: '' },
          custom_frosting: { _id: '' },
          custom_decorations: [{ _id: '' }]
        });
      }
    } catch (err) {
      console.error('Error submitting customization:', err);
      setError(err.response?.data?.message || err.message || 'Error saving customization');
    }
  };

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <h2>Customize Your Cake</h2>
        </Col>
        <Col xs="auto">
          <Link to="/">
            <Button variant="secondary">Go Back</Button>
          </Link>
        </Col>
      </Row>

      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Card className="mb-4">
          <Card.Body>
            <h4>Basic Information</h4>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Number of Layers</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    value={customData.custom_layers}
                    onChange={handleLayersChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Cake Size</Form.Label>
                  <Form.Select
                    value={customData.custom_size}
                    onChange={handleSizeChange}
                    required
                  >
                    <option value="">Select Size</option>
                    <option value="6">6"</option>
                    <option value="8">8"</option>
                    <option value="10">10"</option>
                    <option value="12">12"</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Cake Shape</Form.Label>
                  <Form.Select
                    value={customData.custom_shape}
                    onChange={handleShapeChange}
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
          </Card.Body>
        </Card>

        <Card className="mb-4">
          <Card.Body>
            <h4>Cake Bases</h4>
            {customData.custom_bases.map((base, index) => (
              <Row key={index} className="mb-3">
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Layer {index + 1} Base</Form.Label>
                    <Form.Select
                      value={base.option_flavor || ''}
                      onChange={(e) => handleBaseChange(index, e.target.value)}
                      required
                      disabled={!customData.custom_size || !customData.custom_shape}
                    >
                      <option value="">Select Base</option>
                      {getFilteredOptions(availableOptions.bases, customData.custom_size).map(opt => (
                        <option key={opt._id} value={opt.option_flavor}>
                          {opt.option_flavor}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            ))}
          </Card.Body>
        </Card>

        <Card className="mb-4">
          <Card.Body>
            <h4>Filling</h4>
            <Row>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Filling Type</Form.Label>
                  <Form.Select
                    value={customData.custom_filling?.option_flavor || ''}
                    onChange={(e) => handleFillingChange(e.target.value)}
                    required
                    disabled={!customData.custom_size || !customData.custom_shape}
                  >
                    <option value="">Select Filling</option>
                    {getFilteredOptions(availableOptions.fillings, customData.custom_size).map(opt => (
                      <option key={opt._id} value={opt.option_flavor}>
                        {opt.option_flavor}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card className="mb-4">
          <Card.Body>
            <h4>Frosting</h4>
            <Row>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Frosting Type</Form.Label>
                  <Form.Select
                    value={customData.custom_frosting?.option_flavor || ''}
                    onChange={(e) => handleFrostingChange(e.target.value)}
                    required
                    disabled={!customData.custom_size || !customData.custom_shape}
                  >
                    <option value="">Select Frosting</option>
                    {getFilteredOptions(availableOptions.frostings, customData.custom_size).map(opt => (
                      <option key={opt._id} value={opt.option_flavor}>
                        {opt.option_flavor}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card className="mb-4">
          <Card.Body>
            <h4>Decorations</h4>
            {customData.custom_decorations.map((decoration, index) => (
              <Row key={index} className="mb-3">
                <Col md={10}>
                  <Form.Group>
                    <Form.Label>Decoration Type</Form.Label>
                    <Form.Select
                      value={decoration.option_flavor || ''}
                      onChange={(e) => handleDecorationChange(index, e.target.value)}
                      required
                      disabled={!customData.custom_size || !customData.custom_shape}
                    >
                      <option value="">Select Decoration</option>
                      {getFilteredOptions(availableOptions.decorations, customData.custom_size).map(opt => (
                        <option key={opt._id} value={opt.option_flavor}>
                          {opt.option_flavor}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={2} className="d-flex align-items-end">
                  <Button
                    variant="danger"
                    onClick={() => removeDecoration(index)}
                    disabled={customData.custom_decorations.length === 1}
                  >
                    Remove
                  </Button>
                </Col>
              </Row>
            ))}
            <Button variant="secondary" onClick={addDecoration}>
              Add Decoration
            </Button>
          </Card.Body>
        </Card>

        <Button 
          variant="primary" 
          type="submit" 
          className="mt-3"
          disabled={!customData.custom_size || !customData.custom_shape}
        >
          Create Custom Cake
        </Button>
      </Form>
    </Container>
  );
};

export default Customize; 