import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Alert, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const UpdateOption = () => {
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [availableIngredients, setAvailableIngredients] = useState([]);
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

  useEffect(() => {
    fetchOptions();
    fetchIngredients();
  }, []);

  const fetchOptions = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/option');
      if (response.data.status === 'Success') {
        setOptions(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch options');
      }
    } catch (err) {
      setError('Failed to fetch options: ' + (err.response?.data?.message || err.message));
    }
  };

  const fetchIngredients = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/ingredient2');
      setAvailableIngredients(response.data);
    } catch (err) {
      setError('Failed to fetch ingredients: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const getFlavorOptions = (optionName) => {
    switch (optionName) {
      case 'cake base':
        return [
          { value: 'vanilla', label: 'Vanilla' },
          { value: 'chocolate', label: 'Chocolate' },
          { value: 'red velvet', label: 'Red Velvet' }
        ];
      case 'filling':
        return [
          { value: 'pineapple sauce', label: 'Pineapple Sauce' },
          { value: 'cream cheese', label: 'Cream Cheese' },
          { value: 'chocolate ganache', label: 'Chocolate Ganache' }
        ];
      case 'frosting':
        return [
          { value: 'butter cream', label: 'Butter Cream' },
          { value: 'fondant', label: 'Fondant' },
          { value: 'whipped cream', label: 'Whipped Cream' }
        ];
      case 'decorations':
        return [
          { value: 'ruffles', label: 'Ruffles' },
          { value: 'simple', label: 'Simple' },
          { value: 'roses', label: 'Roses' }
        ];
      default:
        return [];
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'option_name') {
      // Reset flavor when option name changes
      setSelectedOption(prev => ({
        ...prev,
        [name]: value,
        option_flavor: ''
      }));
    } else {
      setSelectedOption(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...selectedOption.ingredients];
    if (field === 'name') {
      // Find the selected ingredient from availableIngredients
      const selectedIngredient = availableIngredients.find(ing => ing.name === value);
      newIngredients[index] = {
        ...newIngredients[index],
        _id: selectedIngredient?._id || '',
        name: value,
        unit: selectedIngredient?.unit || 'grams'
      };
    } else {
      newIngredients[index] = {
        ...newIngredients[index],
        [field]: field === 'quantity' ? parseFloat(value) || 0 : value
      };
    }
    setSelectedOption(prev => ({
      ...prev,
      ingredients: newIngredients
    }));
  };

  const addIngredient = () => {
    setSelectedOption(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { _id: '', name: '', quantity: 0, unit: 'grams' }]
    }));
  };

  const removeIngredient = (index) => {
    setSelectedOption(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    if (!selectedOption.option_name || !selectedOption.option_flavor || !selectedOption.option_size || !selectedOption.option_shape || !selectedOption.option_price) {
      setError('Please fill in all required fields');
      return false;
    }

    if (!['6', '8', '10', '12'].includes(selectedOption.option_size)) {
      setError('Option size must be one of: 6, 8, 10, 12');
      return false;
    }

    if (!['round', 'square', 'heart'].includes(selectedOption.option_shape.toLowerCase())) {
      setError('Option shape must be one of: round, square, heart');
      return false;
    }

    const price = Number(selectedOption.option_price);
    if (isNaN(price) || price < 0) {
      setError('Price must be a valid positive number');
      return false;
    }

    if (selectedOption.ingredients.length === 0) {
      setError('Please add at least one ingredient');
      return false;
    }

    for (const ingredient of selectedOption.ingredients) {
      if (!ingredient.name) {
        setError('Each ingredient must have a name');
        return false;
      }
      if (typeof ingredient.quantity !== 'number' || ingredient.quantity <= 0) {
        setError('Each ingredient must have a valid positive quantity');
        return false;
      }
    }

    return true;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const formData = {
        ...selectedOption,
        option_price: Number(selectedOption.option_price)
      };

      const response = await axios.put(
        `http://localhost:4000/api/option/update/${selectedOption._id}`,
        formData
      );

      if (response.data.status === 'Success') {
        setSuccess('Option updated successfully!');
        setSelectedOption(null);
        fetchOptions();
      } else {
        setError(response.data.message || 'Failed to update option');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update option');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedOption) return;
    
    if (window.confirm('Are you sure you want to delete this option? This action cannot be undone.')) {
      setLoading(true);
      setError('');
      setSuccess('');

      try {
        const response = await axios.delete(`http://localhost:4000/api/option/delete/${selectedOption._id}`);
        
        if (response.data.status === 'Success') {
          setSuccess('Option deleted successfully!');
          setSelectedOption(null);
          fetchOptions(); // Refresh the options list
        } else {
          setError(response.data.message || 'Failed to delete option');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete option');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <h2>Customizing Options</h2>
        </Col>
        <Col xs="auto">
          <Link to="/insert-option">
            <Button variant="success">Add New Option</Button>
          </Link>
        </Col>
      </Row>
      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mb-4">
        <Col>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Flavor</th>
                <th>Size</th>
                <th>Shape</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {options.map((option) => (
                <tr key={option._id}>
                  <td>{option._id}</td>
                  <td>{option.option_name}</td>
                  <td>{option.option_flavor}</td>
                  <td>{option.option_size}</td>
                  <td>{option.option_shape}</td>
                  <td>${option.option_price}</td>
                  <td>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleOptionSelect(option)}
                    >
                      Select
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      {selectedOption && (
        <Form onSubmit={handleUpdate}>
          <Row className="mb-4">
            <Col>
              <h3>Edit Option</h3>
            </Col>
            <Col xs="auto">
              <Button
                variant="danger"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete Option'}
              </Button>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col>
              <h3>Edit Option</h3>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Option Name</Form.Label>
                <Form.Select
                  name="option_name"
                  value={selectedOption.option_name}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Option Type</option>
                  <option value="cake base">Cake Base</option>
                  <option value="filling">Filling</option>
                  <option value="frosting">Frosting</option>
                  <option value="decorations">Decorations</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Option Flavor</Form.Label>
                <Form.Select
                  name="option_flavor"
                  value={selectedOption.option_flavor}
                  onChange={handleChange}
                  required
                  disabled={!selectedOption.option_name}
                >
                  <option value="">Select {selectedOption.option_name || 'Option Type'} First</option>
                  {getFlavorOptions(selectedOption.option_name).map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Option Size</Form.Label>
                <Form.Select
                  name="option_size"
                  value={selectedOption.option_size}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Size</option>
                  <option value="6">6 inches</option>
                  <option value="8">8 inches</option>
                  <option value="10">10 inches</option>
                  <option value="12">12 inches</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Option Shape</Form.Label>
                <Form.Select
                  name="option_shape"
                  value={selectedOption.option_shape}
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
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  name="option_price"
                  value={selectedOption.option_price}
                  onChange={handleChange}
                  placeholder="Enter price"
                  min="0"
                  step="0.01"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Option Specifications</Form.Label>
                <Form.Control
                  type="text"
                  name="option_specifications"
                  value={selectedOption.option_specifications}
                  onChange={handleChange}
                  placeholder="Enter any additional specifications"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <h4>Ingredients</h4>
              {selectedOption.ingredients.map((ingredient, index) => (
                <Row key={index} className="mb-2">
                  <Col md={5}>
                    <Form.Select
                      value={ingredient.name}
                      onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                      required
                    >
                      <option value="">Select Ingredient</option>
                      {availableIngredients.map(ing => (
                        <option key={ing._id} value={ing.name}>
                          {ing.name} ({ing.unit})
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col md={5}>
                    <Form.Control
                      type="number"
                      value={ingredient.quantity}
                      onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                      placeholder="Quantity"
                      min="0"
                      step="0.01"
                      required
                    />
                    {ingredient.unit && (
                      <small className="text-muted">Unit: {ingredient.unit}</small>
                    )}
                  </Col>
                  <Col md={2}>
                    <Button
                      variant="danger"
                      onClick={() => removeIngredient(index)}
                      disabled={selectedOption.ingredients.length === 1}
                    >
                      Remove
                    </Button>
                  </Col>
                </Row>
              ))}
              <Button variant="secondary" onClick={addIngredient} className="mt-2">
                Add Ingredient
              </Button>
            </Col>
          </Row>

          <Button
            variant="primary"
            type="submit"
            className="mt-3"
            disabled={loading}
          >
            {loading ? 'Updating Option...' : 'Update Option'}
          </Button>
        </Form>
      )}
    </Container>
  );
};

export default UpdateOption; 