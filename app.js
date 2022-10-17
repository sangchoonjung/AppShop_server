const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");

const app = express();

const accountRouter = require("./router/accountRouter");
const productRouter = require("./router/productRouter");
const userInfoRouter = require("./router/userInfoRouter");

dotenv.config();
mongoose.connect(process.env.MONGODB_URI,{dbName:"perfume"});

//몽고 설정

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

app.use("/api/account", accountRouter);
app.use("/api/product", productRouter);
app.use("/api/userInfo", userInfoRouter)


app.listen(8081,()=>{
    console.log("PERFUME SERVER START");
});