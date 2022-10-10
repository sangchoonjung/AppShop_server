const express = require('express');
const Product = require('../model/product');

const router = express.Router();

// 찜 추가삭제
router.post("/zzim", async (req, resp) => {
    console.log(req.body);
    try {
        const {user} = req.body;
        const {zzim} = req.body;
        console.log(user,zzim)
        //이후 코드 수정필요
        // const data = await Product.find();
        // resp.status(200).json({ result: true, message: data });
    } catch (e) {
        resp.status(401).json({ result: false });
    }


});


module.exports = router;
