const express = require('express');
const Product = require('../../model/commonModel/Product');
// const Account = require("../ConsumerRouter/ConsumerAccountRouter");
const router = express.Router();
const path = require("path");

const fs = require("fs")
const multer = require("multer");
const ConsumerAccount = require('../../model/ConsumerModel/ConsumerAccount');

// 찜 추가삭제 (완)
router.post("/zzim", async (req, resp) => {

    try {
        const { user } = req.body;
        const { zzimList } = req.body;
        console.log(zzimList, "밸륜ㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴ")

        const response = await ConsumerAccount.findOneAndUpdate({ id: user }, {
            zzimList: zzimList
        }, { returnDocument: "after" })
        resp.status(200).json({ result: true, message: response });
    } catch (e) {
        console.log(e.message)
        resp.status(401).json({ result: false });
    }
});

// 소비자 리뷰 사진등록
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, callback) {
            const dest = path.join(__dirname, "..", "static", "image");
            console.log(dest);
            if (!fs.existsSync(dest)) {
                fs.mkdirSync(dest, { recursive: true });
            }
            callback(null, dest);
        },
        filename: (req, file, cb) => {
            let newName = 'img_' + Date.now();
            cb(null, newName);
        }
    })
})


// const upload = multer({storage:uploadStorage});
//리뷰
router.post("/requestReview", upload.single("image"), async (req, resp) => {

    const { uid } = req.body
    const { productId } = req.body
    const { completeList } = req.body
    try {
        const origin = await Product.findOne({ key: productId }).select("review").lean()
        console.log(origin)
        const updateProduct = await Product.findOneAndUpdate({ key: productId }, {
            "review": [...origin.review, {
                uid: uid,
                content: {
                    title: req.body.title,
                    rating: req.body.rating,
                    review: req.body.review,
                    uid: uid
                },
                imgPath: req.file.path.split('static')[1],
                reviewDate: Date.now()
            }]
        }, {
            returnDocument: "after"
        });
        console.log(updateProduct)
        if (updateProduct) {
            const updateBefore = await Account.findOne({ id: uid }).select("completeReview").lean()

            const updateAfter = await Account.findOneAndUpdate({ id: uid }, {
                completeReview: [...updateBefore?.completeReview, productId]
            }, {
                returnDocument: "after"
            })

            const itemId = completeList.map(e => { return e.productId })
            console.log(completeList)
            const data = await Product.find({ key: { $in: itemId } }).lean();


            const sortedValue = data.map(e => {
                const idx = completeList.findIndex(elm => elm.productId === e.key)
                return { ...e, date: completeList[idx].date, unit: completeList[idx].unit, price: requestSearchItem[idx].price, type: "complete" }
            }
            ).sort((a, b) => a.date - b.date)

            console.log(sortedValue);
            return resp.status(200).json({ result: true, message: updateAfter, updateProduct: sortedValue });
        }
        console.log(updateAfter.completeReview, "updateAfter")
        resp.status(401).json({ result: false });
    } catch (e) {
        console.log(e.message);
        resp.status(401).json({ result: false });

    }
    // })

})


//일단은 더미코드
router.post("/pendToComple", async (req, resp) => {
    console.log(req.body);
    try {
        const origin = await ConsumerAccount.findOne({ id: req.body.id }).select("productCompleteItem");
        // console.log(origin.productCompleteItem,"origin")
        const response = await Account.findOneAndUpdate({ id: req.body.id }, {
            productPendingItem: [],
            productCompleteItem: [...origin.productCompleteItem, ...req.body.pendingList]
        }, {
            returnDocument: "after"
        })
        console.log(response)
        return resp.status(200).json({ result: true, message: response.productCompleteItem });
    } catch (e) {
        console.log(e.message);
        return resp.status(401).json({ result: false });

    }

})


module.exports = router;
