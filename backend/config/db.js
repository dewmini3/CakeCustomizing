const mongoose = require('mongoose');
const dburl = "mongodb+srv://nsirisooriya:g00glevv@cluster0.9kqrd.mongodb.net/product_db?retryWrites=true&w=majority&appName=Cluster0";

// Only set strictQuery if you want strict query mode
mongoose.set("strictQuery", true);

const connection = async () => {
    try {
        await mongoose.connect(dburl); // No options needed
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Error connecting to MongoDB", err);
        process.exit();
    }
};

module.exports = connection;