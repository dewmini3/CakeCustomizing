const express = require("express");
const router = express.Router();
const Discontinued_product =require("../models/discontinued_product");
const Product =require("../models/Product");
const Ingredient = require("../models/Ingredient2");

http://localhost:3000/api/discontinued_product/restore/vfdrdhgu

router.route("/restore/:discontinued_product_id").delete(async (req, res) => {
    try {
        const _id = req.params.discontinued_product_id;

        
        const discontinued_Product = await Discontinued_product.findById(_id);
        if (!discontinued_Product) {
            return res.status(404).send({ status: "Product not found in archive" });
        }

        
        const product = new Product({
            _id: discontinued_Product._id, 
            product_name: discontinued_Product.discontinued_product_name,
            product_weight: discontinued_Product.discontinued_product_weight,
            product_price: discontinued_Product.discontinued_product_price,
            product_description: discontinued_Product.discontinued_product_description,
            flavor: discontinued_Product.discontinued_flavor,
            occasion: discontinued_Product.discontinued_occasion,
            specification: discontinued_Product.discontinued_specification,
            product_image: discontinued_Product.discontinued_product_image,
            ingredients: discontinued_Product.discontinued_ingredients,
        });

        await product.save(); 

        
        await Discontinued_product.findByIdAndDelete(_id);

        res.status(200).send({ status: "Product restored successfully" });

    } catch (err) {
        console.error(err.message);
        res.status(500).send({ status: "Error while restoring product", error: err.message });
    }
});

http://localhost:3000/api/discontinued_product

router.route("/").get((req,res)=>{

    Discontinued_product.find().then(discontinued_products =>{
        res.json(discontinued_products)
    }).catch(err=>{
        console.log(err);
    })
})

http://localhost:3000/api/discontinued_product/delete/crntpdcts

router.route("/delete/:product_id").delete(async (req, res) => {
    let _id = req.params.product_id;

    
    await Discontinued_product.findByIdAndDelete(_id)
        .then(()=>{
            res.status(200).send({status: "Product deleted"})
        }).catch((err) => {
            console.log(err.message);
            res.status(500).send({status: "Error with deleting Product", error: err.message});

        })
})

http://localhost:3000/api/discontinued_product/get/crntpdcts
router.route("/get/:product_id").get(async (req, res)=>{
    try{
    const _id = req.params.product_id;
    const discontinued_Product = await Discontinued_product.findById(_id)
    
    if (!discontinued_Product) {
        return res.status(404).json({ status: "Product not found" });
    }

        res.status(200).send({status: "Product Fetched", discontinued_product})
    }catch(err)  {
            console.log(err.message);
            res.status(500).send({status: "Error with fetching Product", error: err.message});
    }
    

})   


module.exports = router;