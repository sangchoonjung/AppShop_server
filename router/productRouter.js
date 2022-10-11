const express = require('express');
const { emit } = require('../model/product');
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
        const data = await Product.find({ title: { $regex: String(requestSearchItem) } });
        resp.status(200).json({ result: true, message: data });
    } catch (e) {
        console.log(e);
        resp.status(500).json({ result: false });
    }


})
//카테고리 선정을 통한 상품 읽어오기
router.post("/categoryProductList", async (req, resp) => {
    try {
        const requestSearchItem = req.body.category;
        const data = await Product.find({ category: { $in: requestSearchItem } });
        resp.status(200).json({ result: true, message: data });
    } catch (e) {
        console.log(e);
        resp.status(500).json({ result: false });
    }


})

//찜리스트에서 상품 불러오기
router.post("/zzimProductList", async (req, resp) => {
    // console.log(req.body.zzimList, "req.body")

    try {
        const requestSearchItem = req.body.zzimList;
        const itemId = requestSearchItem.map(e => { return e.id })
        // console.log(itemId)
        const data = await Product.find({ key: { $in: itemId } }).lean();
        // console.log(data)

        const sortedValue = data.map(e => {
            const idx= requestSearchItem.findIndex(elm=>elm.id===e.key)
            return {...e, date : requestSearchItem[idx].date}
        }
        ).sort((a,b)=>a.date-b.date)
        
        console.log(sortedValue,"sortedValue")
        resp.status(200).json({ result: true, message: sortedValue })
    } catch (e) {
        console.log(e.message)
    }
})
module.exports = router;
