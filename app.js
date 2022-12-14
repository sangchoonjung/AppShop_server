const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");

const path = require("path")

const app = express();

const ConsumerAccountRouter = require("./router/ConsumerRouter/ConsumerAccountRouter");
const ProductRouter = require("./router/commonRouter/ProductRouter");
const ConsumerUserInfoRouter = require("./router/ConsumerRouter/ConsumerUserInfoRouter");
const SellerAccountRouter = require("./router/SellerRouter/SellerAccountRouter");

dotenv.config();
mongoose.connect(process.env.MONGODB_URI, { dbName: "AppShop" });

//몽고 설정

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

app.use("/api/Account", ConsumerAccountRouter);
app.use("/api/Account", SellerAccountRouter);

app.use("/api/product", ProductRouter);
app.use("/api/userInfo", ConsumerUserInfoRouter)

app.use(express.static(path.join(__dirname, "static")));

app.listen(8080, () => {
    console.log("AppShop SERVER START");
});