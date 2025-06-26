const express = require("express"); 
const dbConnection = require("./config/db");
const orderRouter = require("./routes/orders.js");
const ingredient2Router = require("./routes/ingredients.js");
const completed_orderRouter = require("./routes/completed_orders.js");
const customizeRouter = require("./routes/customizes.js");
const productRouter = require("./routes/products.js");
const discontinued_productRouter = require("./routes/discontinued_products.js");
const optionRouter = require("./routes/options.js");
const feedbackRouter = require("./routes/feedback.js");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors({origin:true, credentials:true}));

dbConnection();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",(req, res) =>res.send("Hello server is running!"));

app.use("/api/ingredient2", ingredient2Router);
app.use("/api/order", orderRouter);
app.use("/api/completed_order", completed_orderRouter);
app.use("/api/product", productRouter);
app.use("/api/customize", customizeRouter);
app.use("/api/discontinued_product", discontinued_productRouter);
app.use("/api/option", optionRouter);
app.use("/api/feedback", feedbackRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port number: ${PORT}`)
});
