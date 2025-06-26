import React,{useState, useEffect} from 'react'
import axios from "axios";
import Cake_cards from "./Product_cards"
import "./Cake_list.css";
const Cakes = () => {

    const [product, setProducts] =useState([]);

    useEffect(() => {
        axios.get("http://localhost:4000/api/product").then((res) => {
        
            setProducts(res.data);
            console.log(res.data);
        })

        .catch(()=>{
            console.log("Error while fetching products");
        });

        },[]);
    const cakes =product.length === 0 ? 
    "No cakes found!"
    : product.map((product,index) => (
    <Cake_cards key ={index} product={product}/>)
);
    
  return (
    <div className="Show Cakes">
      <div className="container">
        <div className="list">
        {cakes}
        </div>
     </div>
    
    </div>
    );
};

export default Cakes;
