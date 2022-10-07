const express = require('express');
const Product = require('../model/product');

const router = express.Router();

// 전체 상품 읽어오기
router.post("/allProductList", async (req, resp) => {
    console.log(req.body);

    try {
        const data = await Product.find();
        resp.status(200).json({ result: true, message: data });
    } catch (e) {
        resp.status(401).json({ result: false });
    }



});


module.exports = router;
