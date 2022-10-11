const express = require('express');
const Product = require('../model/product');
const Account = require("../model/account");

const router = express.Router();

// 찜 추가삭제
router.post("/zzim", async (req, resp) => {
    console.log(req.body);
    try {
        const {user} = req.body;
        const value = req.body.zzimList;
        console.log(user,value)
        const  response = await Account.findOneAndUpdate({id:user},{
            zzimList:value
        })
        resp.status(200).json({ result: true, message: response });
    } catch (e) {
        console.log(e.message)
        resp.status(401).json({ result: false });
    }


});


module.exports = router;
