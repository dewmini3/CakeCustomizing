import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form, Container, Row, Col, Card, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const OCCASION_OPTIONS = [
  "Birthday", "Wedding", "Anniversary", "Graduation", "Baby Shower", "Christmas", "Valentine's Day"
];
const SPECIFICATION_OPTIONS = [
  "Eggless", "Sugar-free", "Gluten-free", "Vegan", "Nut-free", "Low-calorie"
];

const UpdateForm = () => {
  const [products, setProducts] = useState([]);
  const [updatedData, setUpdatedData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [imageSource, setImageSource] = useState("upload");
  const [productImage, setProductImage] = useState(null);
  const [productIngredients, setProductIngredients] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    axios.get("http://localhost:4000/api/product")
      .then((res) => setProducts(res.data))
      .catch(() => setErrorMessage("Failed to fetch products"));
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:4000/api/product/delete/${id}`)
      .then(() => {
        setProducts(products.filter(product => product._id !== id));
        setSuccessMessage("Product deleted successfully");
        setTimeout(() => setSuccessMessage(''), 3000);
      })
      .catch(() => {
        setErrorMessage("Failed to delete product");
        setTimeout(() => setErrorMessage(''), 3000);
      });
  };

  const openUpdateModal = (product) => {
    setCurrentProduct(product);
    const { flavor = [], occasion = [], specifications = [] } = product.product_category || {};
    setUpdatedData({
      product_name: product.product_name,
      product_weight: product.product_weight,
      product_description: product.product_description,
      product_price: product.product_price,
      flavor: flavor.join(", "),
      occasion: occasion.join(", "),
      specifications: specifications.join(", "),
      product_image_url: "",
      lastUpdated: new Date().toISOString()
    });
    setProductIngredients(product.ingredients || []);
    setImageSource("upload");
    setProductImage(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentProduct(null);
    setProductImage(null);
    setImageSource("upload");
    setProductIngredients([]);
  };

  const handleIngredientChange = (index, value) => {
    const updated = [...productIngredients];
    updated[index].quantity = value === "" ? "" : Number(value);
    setProductIngredients(updated);
  };

  const handleInputChange = (field, value) => {
    setUpdatedData(prevData => ({
      ...prevData,
      [field]: value,
      lastUpdated: new Date().toISOString()
    }));
  };

  const handleSourceChange = (e) => {
    setImageSource(e.target.value);
    setProductImage(null);
    setUpdatedData(prev => ({ ...prev, product_image_url: "" }));
  };

  const handleFileChange = (e) => {
    setProductImage(e.target.files[0]);
  };

  const handleOccasionChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setUpdatedData(prev => ({ ...prev, occasion: selected.join(", ") }));
  };

  const handleSpecificationChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setUpdatedData(prev => ({ ...prev, specifications: selected.join(", ") }));
  };

  const handleUpdate = () => {
    if (!currentProduct) return;

    const formData = new FormData();
    formData.append("product_name", updatedData.product_name);
    formData.append("product_weight", updatedData.product_weight);
    formData.append("product_description", updatedData.product_description);
    formData.append("product_price", updatedData.product_price);
    formData.append("flavor", updatedData.flavor);
    formData.append("occasion", updatedData.occasion);
    formData.append("specifications", updatedData.specifications);
    formData.append("ingredients", JSON.stringify(productIngredients));
    formData.append("lastUpdated", updatedData.lastUpdated);

    if (imageSource === "upload" && productImage) {
      formData.append("product_image", productImage);
    } else if (imageSource === "url" && updatedData.product_image_url) {
      formData.append("product_image_url", updatedData.product_image_url);
    }

    axios.put(`http://localhost:4000/api/product/update/${currentProduct._id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(() => {
        fetchProducts();
        closeModal();
        setSuccessMessage("Product updated successfully");
        setTimeout(() => setSuccessMessage(''), 3000);
      })
      .catch(() => {
        setErrorMessage("Failed to update product");
        setTimeout(() => setErrorMessage(''), 3000);
      });
  };

  return (
    <Container className="py-4">
      <h2 className="text-center mb-4">Manage Cake Products</h2>
      {successMessage && <Alert variant="success" className="mb-3">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger" className="mb-3">{errorMessage}</Alert>}
      <Row xs={1} md={2} lg={3} className="g-4">
        {products.length === 0 ? (
          <Col>
            <Alert variant="info">No cakes found!</Alert>
          </Col>
        ) : (
          products.map((product, index) => (
            <Col key={index}>
              <Card className="h-100">
                <Card.Body>
                  <h5>{product.product_name}</h5>
                  <p><b>Price:</b> ${product.product_price}</p>
                  <p><b>Weight:</b> {product.product_weight}</p>
                  <p><b>Flavors:</b> {(product.product_category?.flavor || []).join(", ")}</p>
                  <p><b>Occasions:</b> {(product.product_category?.occasion || []).join(", ")}</p>
                  <p><b>Specifications:</b> {(product.product_category?.specifications || []).join(", ")}</p>
                  <div className="d-flex justify-content-between mt-3">
                    <Button variant="primary" onClick={() => openUpdateModal(product)}>Edit</Button>
                    <Button
                      variant="danger"
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete this product?")) {
                          handleDelete(product._id);
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
      {/* Update Modal */}
      <Modal show={showModal} onHide={closeModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Update Cake Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentProduct && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                  type="text"
                  value={updatedData.product_name || ''}
                  onChange={e => handleInputChange('product_name', e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Product Weight</Form.Label>
                <Form.Control
                  type="text"
                  value={updatedData.product_weight || ''}
                  onChange={e => handleInputChange('product_weight', e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={updatedData.product_description || ''}
                  onChange={e => handleInputChange('product_description', e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Price ($)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  value={updatedData.product_price || ''}
                  onChange={e => handleInputChange('product_price', e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Flavors (comma separated)</Form.Label>
                <Form.Control
                  type="text"
                  value={updatedData.flavor || ''}
                  onChange={e => handleInputChange('flavor', e.target.value)}
                  placeholder="e.g. Chocolate, Vanilla"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Occasions</Form.Label>
                <Form.Control
                  as="select"
                  multiple
                  value={updatedData.occasion ? updatedData.occasion.split(",").map(s => s.trim()) : []}
                  onChange={handleOccasionChange}
                  className="form-control"
                  required
                >
                  {OCCASION_OPTIONS.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </Form.Control>
                <Form.Text className="text-muted">Hold Ctrl (Windows) or Cmd (Mac) to select multiple.</Form.Text>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Specifications</Form.Label>
                <Form.Control
                  as="select"
                  multiple
                  value={updatedData.specifications ? updatedData.specifications.split(",").map(s => s.trim()) : []}
                  onChange={handleSpecificationChange}
                  className="form-control"
                  required
                >
                  {SPECIFICATION_OPTIONS.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </Form.Control>
                <Form.Text className="text-muted">Hold Ctrl (Windows) or Cmd (Mac) to select multiple.</Form.Text>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Image</Form.Label>
                <div>
                  <Form.Check
                    inline
                    label="Upload"
                    type="radio"
                    name="imageSource"
                    value="upload"
                    checked={imageSource === "upload"}
                    onChange={handleSourceChange}
                  />
                  <Form.Check
                    inline
                    label="URL"
                    type="radio"
                    name="imageSource"
                    value="url"
                    checked={imageSource === "url"}
                    onChange={handleSourceChange}
                  />
                </div>
                {imageSource === "upload" ? (
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                ) : (
                  <Form.Control
                    type="text"
                    placeholder="Image URL"
                    value={updatedData.product_image_url || ''}
                    onChange={e => handleInputChange('product_image_url', e.target.value)}
                  />
                )}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Ingredients</Form.Label>
                {productIngredients.length === 0 ? (
                  <div>Loading ingredients...</div>
                ) : (
                  productIngredients.map((ingredient, index) => (
                    <div key={index} className="d-flex mb-2">
                      <Form.Control
                        type="text"
                        value={ingredient.name}
                        readOnly
                        style={{ width: '30%', marginRight: '5px' }}
                      />
                      <Form.Control
                        type="number"
                        placeholder="Quantity"
                        value={ingredient.quantity}
                        min="0"
                        step="any"
                        onChange={e => handleIngredientChange(index, e.target.value)}
                        style={{ width: '30%', marginRight: '5px' }}
                      />
                      <Form.Control
                        type="text"
                        value={ingredient.unit}
                        readOnly
                        style={{ width: '30%' }}
                      />
                    </div>
                  ))
                )}
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UpdateForm;
