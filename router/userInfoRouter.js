const express = require('express');
const Product = require('../model/product');
const Account = require("../model/account");
const Review = require("../model/review");
const fs = require("fs")
const router = express.Router();

// 찜 추가삭제
router.post("/zzim", async (req, resp) => {
    console.log(req.body);
    try {
        const { user } = req.body;
        const value = req.body.zzimList;
        console.log(user, value)
        const response = await Account.findOneAndUpdate({ id: user }, {
            zzimList: value
        })
        resp.status(200).json({ result: true, message: response });
    } catch (e) {
        console.log(e.message)
        resp.status(401).json({ result: false });
    }


});

//리뷰
router.post("/requestReview", async (req, resp) => {
    const data = req.body.formData._parts
    try {
        const response = await Review.create({
            content: data[0][1],
            image: data[1][1],
            id: data[2][1],
        });
        if (response) {
            const updateBefore = await Account.findOne({ id: data[2][1] }).select("completeReview").lean()
            // console.log(updateBefore.completeReview, "updateBefore")
            // console.log(data[0][1].productId, "data[0][1]")
            const updateAfter = await Account.findOneAndUpdate({ id: data[2][1] }, {
                completeReview: [...updateBefore?.completeReview, data[0][1].productId]
            }, {
                returnDocument: "after"
            })
            return resp.status(200).json({ result: true, message: updateAfter });
        }
        resp.status(401).json({ result: false });
    } catch (e) {
        console.log(e.message);
    }
})



//일단은 더미코드
router.post("/pendToComple", async (req, resp) => {
console.log(req.body);
try{
    const origin = await Account.findOne({id:req.body.id}).select("productCompleteItem");
    // console.log(origin.productCompleteItem,"origin")
    const response = await Account.findOneAndUpdate({id:req.body.id},{
        productPendingItem:[],
        productCompleteItem:[...origin.productCompleteItem,...req.body.pendingList]
    },{
        returnDocument:"after"
    })
    console.log(response)
    return resp.status(200).json({result:true,message:response.productCompleteItem});
}catch(e){
    console.log(e.message);

}

resp.status(401).json({ result: false });
})


module.exports = router;
