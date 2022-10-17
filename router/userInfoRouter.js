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
    // console.log(data)
    const uid = data[2][1];
    const content = data[0][1];
    const imgData = data[1][1];
    const productId = data[0][1].productId;
    const completeListOrigin = data[2][1];
    console.log(uid,content)
    try {
        
        const origin = await Product.findOne({key:productId}).select("review").lean()
        console.log(origin)
        const updateProduct = await Product.findOneAndUpdate({key:productId},{
            "review":[...origin.review,{
                uid:uid,
                content:{...content},
                imgData:imgData,
                reviewDate:Date.now()
            }]
        },{
            returnDocument:"after"
        });

        if (response) {
            const updateBefore = await Account.findOne({ id: data[2][1] }).select("completeReview").lean()
            console.log(updateBefore.completeReview, "updateBefore")

        // console.log(update.review)

        if (updateProduct) {
            const updateBefore = await Account.findOne({ id: uid }).select("completeReview").lean()


            // console.log(data[0][1].productId, "data[0][1]")
            const updateAfter = await Account.findOneAndUpdate({ id: uid }, {
                completeReview: [...updateBefore?.completeReview, productId]
            }, {
                returnDocument: "after"
            })
            return resp.status(200).json({ result: true, message: updateAfter,updateProduct:updateProduct });
        }
        console.log(updateAfter.completeReview, "updateAfter")
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
