import React, { useState, useEffect } from "react";
import axios from "axios";
import "./InsertProduct.css";

const InsertProduct = () => {
  const [ingredients, setIngredients] = useState([]);
  const [initialIngredients, setInitialIngredients] = useState([]);
  const [productData, setProductData] = useState({
    product_name: "",
    product_weight: "",
    product_description: "",
    product_price: "",
    flavor: "",
    occasion: "",
    specifications: "",
    imageSource: "upload",
    product_image_url: "",
  });
  const [productImage, setProductImage] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Load ingredients on mount
  useEffect(() => {
    axios
      .get("http://localhost:4000/api/ingredient2/")
      .then((response) => {
        const loadedIngredients = response.data.map((item) => ({
          _id: item._id,
          name: item.name,
          unit: item.unit,
          quantity: 0,
        }));
        setIngredients(loadedIngredients);
        setInitialIngredients(loadedIngredients); // Save for reset
      })
      .catch(() => {
        setError("Failed to load ingredients.");
      });
  }, []);

  const handleIngredientChange = (index, value) => {
    const updated = [...ingredients];
    updated[index].quantity = value === "" ? "" : Number(value);
    setIngredients(updated);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleFileChange = (e) => {
    setProductImage(e.target.files[0]);
  };

  const handleSourceChange = (e) => {
    setProductData({ ...productData, imageSource: e.target.value, product_image_url: "" });
    setProductImage(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    const formData = new FormData();
    formData.append("product_name", productData.product_name);
    formData.append("product_weight", productData.product_weight);
    formData.append("product_description", productData.product_description);
    formData.append("product_price", productData.product_price);
    formData.append("flavor", productData.flavor);
    formData.append("occasion", productData.occasion);
    formData.append("specifications", productData.specifications);
    formData.append("ingredients", JSON.stringify(ingredients));

    if (productData.imageSource === "upload" && productImage) {
      formData.append("product_image", productImage);
    } else if (productData.imageSource === "url" && productData.product_image_url) {
      formData.append("product_image_url", productData.product_image_url);
    }

    axios
      .post("http://localhost:4000/api/product/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        setSuccess("Product added successfully!");
        setProductData({
          product_name: "",
          product_weight: "",
          product_description: "",
          product_price: "",
          flavor: "",
          occasion: "",
          specifications: "",
          imageSource: "upload",
          product_image_url: "",
        });
        setProductImage(null);
        setIngredients(initialIngredients.map(i => ({ ...i, quantity: 0 }))); // reset to initial
      })
      .catch(() => {
        setError("Failed to add product. Please check your input.");
      });
  };
  const OCCASION_OPTIONS = [
    "Birthday",
    "Wedding",
    "Anniversary",
    "Graduation",
    "Baby Shower",
    "Christmas",
    "Valentine's Day"
  ];
  
  const SPECIFICATION_OPTIONS = [
    "Eggless",
    "Sugar-free",
    "Gluten-free",
    "Vegan",
    "Nut-free",
    "Low-calorie"
  ];
  return (
    <div className="insert-product-container">
      <h2>Add New Product</h2>
      <form className="insert-product-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <label htmlFor="product_name">Product Name</label>
          <input
            type="text"
            id="product_name"
            name="product_name"
            value={productData.product_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="product_weight">Product Weight</label>
          <input
            type="text"
            id="product_weight"
            name="product_weight"
            value={productData.product_weight}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="product_description">Description</label>
          <textarea
            id="product_description"
            name="product_description"
            value={productData.product_description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="product_price">Price ($)</label>
          <input
            type="number"
            id="product_price"
            name="product_price"
            step="0.01"
            value={productData.product_price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="flavor">Flavors <span className="hint">(comma separated)</span></label>
          <input
            type="text"
            id="flavor"
            name="flavor"
            value={productData.flavor}
            onChange={handleChange}
            placeholder="e.g. Chocolate, Vanilla"
            required
          />
        </div>
       
        <div className="form-group">
              <label htmlFor="occasion">Occasions</label>
              <select
                id="occasion"
                name="occasion"
                multiple
                value={productData.occasion ? productData.occasion.split(",").map(s => s.trim()) : []}
                onChange={e => {
                  const selected = Array.from(e.target.selectedOptions, option => option.value);
                  setProductData({ ...productData, occasion: selected.join(", ") });
                }}
                className="form-control"
              >
                {OCCASION_OPTIONS.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <small className="form-text text-muted">Hold Ctrl (Windows) or Cmd (Mac) to select multiple.</small>
            </div>
        
        <div className="form-group">
            <label htmlFor="specifications">Specifications</label>
            <select
              id="specifications"
              name="specifications"
              multiple
              value={productData.specifications ? productData.specifications.split(",").map(s => s.trim()) : []}
              onChange={e => {
                const selected = Array.from(e.target.selectedOptions, option => option.value);
                setProductData({ ...productData, specifications: selected.join(", ") });
              }}
              className="form-control"
            >
              {SPECIFICATION_OPTIONS.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <small className="form-text text-muted">Hold Ctrl (Windows) or Cmd (Mac) to select multiple.</small>
          </div>
        <div>
          <label>
            <input
              type="radio"
              name="imageSource"
              value="upload"
              checked={productData.imageSource === "upload"}
              onChange={handleSourceChange}
            />
            Upload Image
          </label>
          <label>
            <input
              type="radio"
              name="imageSource"
              value="url"
              checked={productData.imageSource === "url"}
              onChange={handleSourceChange}
            />
            Use Image URL
          </label>
        </div>
        {productData.imageSource === "upload" ? (
          <div>
            <label htmlFor="product_image">Product Image:</label>
            <input
              type="file"
              id="product_image"
              name="product_image"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
          </div>
        ) : (
          <div>
            <label htmlFor="product_image_url">Image URL:</label>
            <input
              type="text"
              id="product_image_url"
              name="product_image_url"
              value={productData.product_image_url}
              onChange={handleChange}
              required
            />
          </div>
        )}
        <div className="form-group">
          <label>Ingredients</label>
          {ingredients.length === 0 ? (
            <div>Loading ingredients...</div>
          ) : (
            ingredients.map((ingredient, index) => (
              <div key={index} className="ingredient-row">
                <input
                  type="text"
                  value={ingredient.name}
                  readOnly
                  style={{ width: '30%' }}
                />
                <input
                  type="number"
                  id={`ingredient_quantity_${index}`}
                  name={`ingredient_quantity_${index}`}
                  placeholder="Quantity"
                  value={ingredient.quantity}
                  onChange={(e) => handleIngredientChange(index, e.target.value)}
                  min="0"
                  step="any"
                  required
                  style={{ width: '30%' }}
                />
                <input
                  type="text"
                  value={ingredient.unit}
                  readOnly
                  style={{ width: '30%' }}
                />
              </div>
            ))
          )}
        </div>
        <button type="submit" className="submit-btn">Add Product</button>
        {success && <div className="success-msg">{success}</div>}
        {error && <div className="error-msg">{error}</div>}
      </form>
    </div>
  );
};

export default InsertProduct;
