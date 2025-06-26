import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cake_cards from "./Cake_cards";
import "./Cake_list.css";

const UpdateCakes = () => {
    const [products, setProducts] = useState([]);
    const [updatedData, setUpdatedData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        fetchCakes();
    }, []);

    const fetchCakes = async () => {
        try {
            const res = await axios.get("http://localhost:4000/api/product");
            setProducts(res.data);
        } catch (error) {
            console.error("Error while fetching products", error);
        }
    };

    // const handleDelete = async (id) => {
    //     try {
    //         await axios.delete(`http://localhost:4000/api/product/delete/${id}`);
    //         setProducts(products.filter(product => product._id !== id));
    //     } catch (error) {
    //         console.error("Error while deleting product", error);
    //     }
    // };
    const handleDelete = async (id) => {
      try {
          
          const response = await axios.delete(`http://localhost:4000/api/product/delete/${id}`);
          
          
          if (response.status === 200) {
              setProducts((prevProducts) => prevProducts.filter(product => product._id !== id));
          } else {
              console.error("Failed to delete product. Response status:", response.status);
          }
      } catch (error) {
          console.error("Error while deleting product", error.response || error);
      }
  };
  

    const handleUpdate = async (id) => {
        if (!updatedData[id]) {
            console.log("No data for product", id);
            return;
        }

        try {
            await axios.put(`http://localhost:4000/api/product/update/${id}`, updatedData[id]);
            fetchCakes();
        } catch (error) {
            console.error("Error while updating product", error);
        }
    };

    const handleInputChange = (id, field, value) => {
        setUpdatedData(prevData => ({
            ...prevData,
            [id]: { ...prevData[id], [field]: value }
        }));
    };

    const cakes = products.length === 0
        ? <p>No cakes found!</p>
        : products.map((product) => (
            <div key={product._id} className="cake-item">
                <Cake_cards product={product} />
                <input 
                    type="text" 
                    value={updatedData[product._id]?.name || product.name} 
                    onChange={(e) => handleInputChange(product._id, 'name', e.target.value)}
                />
                <button onClick={() => navigate("/update-form")}>Update</button>
                <button onClick={() => handleDelete(product._id)}>Delete</button>
            </div>
        ));

    return (
        <div className="cakes-container">
            <div className="cakes-list">
                {cakes}
            </div>
        </div>
    );
};

export default UpdateCakes;
