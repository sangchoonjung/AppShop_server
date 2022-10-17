const express = require('express');
const Product = require('../model/product');
const Account = require("../model/account");
const router = express.Router();
const path = require("path");

const fs = require("fs")
const multer = require("multer");

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
                imgPath: req.file.path.split('static'),
                reviewDate: Date.now()
            }]
        }, {
            returnDocument: "after"
        });

        if (updateProduct) {
            const updateBefore = await Account.findOne({ id: uid }).select("completeReview").lean()

            const updateAfter = await Account.findOneAndUpdate({ id: uid }, {
                completeReview: [...updateBefore?.completeReview, productId]
            }, {
                returnDocument: "after"
            })
            return resp.status(200).json({ result: true, message: updateAfter, updateProduct: updateProduct });
        }
        console.log(updateAfter.completeReview, "updateAfter")
        resp.status(401).json({ result: false });
    } catch (e) {
        console.log(e.message);
    }
    // })

})


//일단은 더미코드
router.post("/pendToComple", async (req, resp) => {
    console.log(req.body);
    try {
        const origin = await Account.findOne({ id: req.body.id }).select("productCompleteItem");
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

    }

    resp.status(401).json({ result: false });
})


module.exports = router;
