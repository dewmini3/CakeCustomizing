const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Ingredient = require("../models/Ingredient2");
const Discontinued_product = require("../models/discontinued_product");
const getNextSequenceValue = require("../utils/sequence");
const getSequenceValue = require("../utils/sequence");
const prefix="OGC-";
const multer = require("multer");
const path = require("path");





const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

http://localhost:4000/api/product/add
router.route("/add").post(upload.single("product_image"), async (req, res) => {
    try {
      const {
        product_name,
        product_weight,
        product_description,
        product_price,
        flavor,
        occasion,
        specifications,
        product_image_url,
        ingredients, // <- added here
      } = req.body;
  
      const parsedIngredients = JSON.parse(ingredients);
  
      let product_image = "";
      if (req.file) {
        product_image = req.file.path;
      } else if (product_image_url) {
        product_image = product_image_url;
      }
  
      const sequenceName = "productid";
      const newId = await getNextSequenceValue(prefix, sequenceName);
  
      const newProduct = new Product({
        _id: newId,
        product_name,
        product_weight,
        product_description,
        product_price,
        product_category: {
          flavor,
          occasion,
          specifications,
        },
        product_image,
        ingredients: parsedIngredients,
      });
  
      await newProduct.save();
  
      // Update stock
      for (const item of parsedIngredients) {
        await Ingredient.findByIdAndUpdate(
          item.ingredientId,
          { $inc: { stock: -item.amount } },
          { new: true }
        );
      }
  
      res.status(201).json({ status: "Product added successfully", Product: newProduct });
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: "Error adding product", error: err.message });
    }
  });
  


http://localhost:4000/api/product

router.route("/").get(async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "Error fetching products", error: err.message });
    }
});


http://localhost:4000/api/product/update/crntpdct

router.route("/update/:product_id").put(upload.single("product_image"), async (req, res) => {
  try {
    const id = req.params.product_id;

    // Parse product_ingredients if it's a string
    let ingredients = [];
    if (req.body.ingredients) {
      if (typeof req.body.ingredients === "string") {
        ingredients = JSON.parse(req.body.ingredients);
      } else {
        ingredients = req.body.ingredients;
      }
    }

    // Parse flavor, occasion, specifications
    const flavor = req.body.flavor ? req.body.flavor.split(",").map(s => s.trim()).filter(Boolean) : [];
    const occasion = req.body.occasion ? req.body.occasion.split(",").map(s => s.trim()).filter(Boolean) : [];
    const specifications = req.body.specifications ? req.body.specifications.split(",").map(s => s.trim()).filter(Boolean) : [];

    // Handle image (file or URL)
    let product_image = req.body.product_image_url || "";
    if (req.file) {
      product_image = req.file.path;
    }

    const updateProduct = {
      product_name: req.body.product_name,
      product_weight: req.body.product_weight,
      product_description: req.body.product_description,
      product_price: req.body.product_price,
      product_category: {
        flavor,
        occasion,
        specifications
      },
      product_image,
      ingredients,
      lastUpdated: req.body.lastUpdated
    };

    const updatedProduct = await Product.findByIdAndUpdate(id, updateProduct, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ status: "Product not found" });
    }

    res.status(200).json({ status: "Product Updated successfully", Product: updatedProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "Error updating product", error: err.message });
  }
});


http://localhost:4000/api/product/delete/crntpdcts

router.route("/delete/:product_id").delete(async (req, res) => {
    try {
        const id = req.params.product_id;

        const discontinued = await Product.findById(id);
        if (!discontinued) {
            return res.status(404).json({ status: "Product not found" });
        }

        const discontinued_product = new Discontinued_product({
            _id: discontinued._id,
            discontinued_product_name: discontinued.product_name,
            discontinued_product_weight: discontinued.product_weight,
            discontinued_product_price: discontinued.product_price,
            discontinued_product_description: discontinued.product_description,
            discontinued_flavor: discontinued.product_category?.flavor || [],
            discontinued_occasion: discontinued.product_category?.occasion || [],
            discontinued_specifications: discontinued.product_category?.specifications || [],
            discontinued_product_image: discontinued.product_image,
            discontinued_ingredients: discontinued.ingredients || [],
            deletedAt: new Date(),
        });

        await discontinued_product.save();
        await Product.findByIdAndDelete(id);

        res.status(200).json({ status: "Product deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "Error deleting product", error: err.message });
    }
});

http://localhost:4000/api/product/get/crntpdcts

router.route("/get/:product_id").get(async (req, res) => {
    try {
        const id = req.params.product_id;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ status: "Product not found" });
        }

        res.status(200).json({ status: "Product fetched", Product: product });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "Error fetching product", error: err.message });
    }
});

http://localhost:4000/api/product/search?q=apple

router.route("/search").get(async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ status: "Query parameter 'q' is required" });
        }

        // Build $or array
        const orArray = [
            { _id: { $regex: q, $options: "i" } },
            { product_name: { $regex: q, $options: "i" } },
            { "product_category.flavor": { $regex: q, $options: "i" } },
            { "product_category.occasion": { $regex: q, $options: "i" } },
            { "product_category.specifications": { $regex: q, $options: "i" } }
        ];

        // If q is a number, also search product_price
        if (!isNaN(q)) {
            orArray.push({ product_price: Number(q) });
        }

        const products = await Product.find({ $or: orArray });

        res.status(200).json({ status: "Search results", products });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "Error searching products", error: err.message });
    }
});


module.exports = router;