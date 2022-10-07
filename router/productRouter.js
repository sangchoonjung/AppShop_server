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
//서치바 이용한 상품 읽어오기
router.post("/searchProductList", async (req, resp) => {
    const requestSearchItem = req.body.search;
    console.log(requestSearchItem);
    try {
        const data = await Product.find({ title: { $regex: requestSearchItem }});
            resp.status(200).json({ result: true, message: data });
    } catch (e) {
        console.log(e);
        resp.status(500).json({ result: false });
    }


})
//카테고리 선정을 통한 상품 읽어오기
router.post("/categoryProductList", async (req, resp) => {
    const requestSearchItem = req.body.category;
    console.log(requestSearchItem);
    try {
        const data = await Product.find({ category: { $regex: requestSearchItem } });
        resp.status(200).json({ result: true, message: data });
    } catch (e) {
        console.log(e);
        resp.status(500).json({ result: false });
    }


})


module.exports = router;
