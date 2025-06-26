import React, { useState, useEffect } from "react";
import axios from "axios";
import UpdateForm from "./components/UpdateForm";

const UpdateProduct = ({ product_id }) => {
  const [productData, setProductData] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (product_id) {
      axios.get(`http://localhost:4000/api/product/get/${product_id}`)
        .then((response) => {
          const product = response.data;
          setProductData({
            _id: product._id,
            product_name: product.product_name,
            product_weight: product.product_weight,
            product_description: product.product_description,
            product_price: product.product_price,
            flavor: product.flavor,
            occasion: product.occasion,
            specifications: product.specifications,
            imageSource: product.product_image_url ? "url" : "upload",
            product_image_url: product.product_image_url || "",
          });

          axios.get("http://localhost:4000/api/ingredient2/")
            .then((ingredientResponse) => {
              const loadedIngredients = ingredientResponse.data.map((item) => {
                const matched = product.ingredients.find((ing) => ing._id === item._id);
                return {
                  _id: item._id,
                  name: item.name,
                  unit: item.unit,
                  quantity: matched ? matched.quantity : 0,
                };
              });
              setIngredients(loadedIngredients);
            })
            .catch(() => setError("Failed to load ingredients."));
        })
        .catch(() => setError("Failed to load product details."));
    }
  }, [product_id]);

  const handleSubmit = (formData, productImage, imageSource) => {
    setSuccess("");
    setError("");

    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      if (key !== "ingredients") {
        submitData.append(key, formData[key]);
      }
    });
    submitData.append("ingredients", JSON.stringify(formData.ingredients));

    if (imageSource === "upload" && productImage) {
      submitData.append("product_image", productImage);
    } else if (imageSource === "url" && formData.product_image_url) {
      submitData.append("product_image_url", formData.product_image_url);
    }

    axios.put(`http://localhost:4000/api/product/update/${formData._id}`, submitData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(() => setSuccess("Product updated successfully!"))
      .catch(() => setError("Failed to update product."));
  };

  if (!productData) return <div>Loading product details...</div>;

  return (
    <UpdateForm
      productData={productData}
      ingredients={ingredients}
      onSubmit={handleSubmit}
      success={success}
      error={error}
    />
  );
};

export default UpdateProduct;
