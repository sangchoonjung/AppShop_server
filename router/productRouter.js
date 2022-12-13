const express = require('express');
const account = require('../model/account');
const Product = require('../model/product');
const router = express.Router();
const jwt = require('jsonwebtoken');

// 셀러가 상품생성하기 
router.post("/createProduct", async (req, resp) => {
    console.log(req.body);
    const item = req.body;
    const token = req.headers['x-access-token'];
    if (!token) {
        return resp.status(403).json({
            success: false,
            message: 'not logged in'
        });
    }

    const auth = jwt.verify(token, process.env.SECRET_KEY,
        function (err, decoded) {
            console.log(err) // 유효하지 않은 토큰
            console.log(decoded) // 유효한 토큰, 유저 정보 Object 반환
        })
    console.log(auth);

    try {
        const response = await Product.create(item);
        resp.status(200).json({ result: true, message: response });

    } catch {
        resp.status(401).json({ result: false });
    }
})



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
            const idx = requestSearchItem.findIndex(elm => elm.id === e.key)
            return { ...e, date: requestSearchItem[idx].date, zzimType: true }
        }
        ).sort((a, b) => a.date - b.date)

        console.log(sortedValue, "sortedValue")
        resp.status(200).json({ result: true, message: sortedValue })
    } catch (e) {
        console.log(e.message)
    }
});


//pending
router.post("/requestProductList", async (req, resp) => {
    try {
        const requestSearchItem = req.body.list;
        console.log(requestSearchItem)
        const itemId = requestSearchItem.map(e => { return e.productId })
        console.log(itemId, "check 1 !!!!!!!!!!!!!!!!")
        const data = await Product.find({ key: { $in: itemId } }).lean();
        // console.log(data)
        // console.log(req.body.type)
        const sortedValue = data.map(e => {
            const idx = requestSearchItem.findIndex(elm => elm.productId === e.key)
            console.log(idx, "sangchoon check!!!!!!!!!!!!!")
            return { ...e, date: requestSearchItem[idx].date, unit: requestSearchItem[idx].unit, price: requestSearchItem[idx].price, type: req.body.type }
        }
        ).sort((a, b) => a.date - b.date)

        console.log(sortedValue, "sortedValue PENDING!!!!!!!!!!!")
        console
        resp.status(200).json({ result: true, message: sortedValue })
    } catch (e) {
        console.log(e.message)
    }
});
//pending 수량 수정
router.post("/requestProductFix", async (req, resp) => {



    try {
        console.log(req.body.id)
        const data = await account.findOne({ id: req.body.id });
        // console.log(data)
        const origin = data.productPendingItem.map(e => {
            if (e.key !== req.body.productId) {
                return e
            }
        })
        console.log(origin)
        let newData = [...origin, { ...req.body }];
        const response = await Account.findOneAndUpdate({
            id: req.body.id
        }, {
            productPendingItem: newData
        }, {
            returnDocument: "after"
        });
        // console.log(response.productPendingItem)
        resp.status(200).json({ result: true, message: response.productPendingItem });
    }
    catch (e) {
        console.log(e.message);
        resp.status(401).json({ result: false });
    }


    /*
    try {



        
        const itemfix = req.body.list;
        console.log(itemfix)
        const itemId = itemfix.map(e => { return e.productId })
        console.log(itemId, "아이템 키값")
        const data = await Product.find({ key: { $in: itemId } }).lean();
        // console.log(data)
        // console.log(req.body.type)
        const sortedValue = data.map(e => {
            const idx = itemfix.findIndex(elm => elm.productId === e.key)
            console.log(idx, "sangchoon check!!!!!!!!!!!!!")
            return { ...e, unit: requestSearchItem[idx].unit, price: requestSearchItem[idx].price, type: req.body.type }
        }
        ).sort((a, b) => a.date - b.date)

        console.log(sortedValue, "sortedValue PENDING!!!!!!!!!!!")
        console
        resp.status(200).json({ result: true, message: sortedValue })
    } catch (e) {
        console.log(e.message)
    }*/
});


//complete
router.post("/requestProductListComplete", async (req, resp) => {
    try {
        const requestSearchItem = req.body.list;
        console.log(requestSearchItem)
        const itemId = requestSearchItem.map(e => { return e.productId })

        const data = await Product.find({ key: { $in: itemId } }).lean();
        // console.log(data)
        console.log(req.body.type)
        const sortedValue = data.map(e => {
            const idx = requestSearchItem.findIndex(elm => elm.productId === e.key)
            return { ...e, date: requestSearchItem[idx].date, unit: requestSearchItem[idx].unit, price: requestSearchItem[idx].price, type: req.body.type }
        }
        ).sort((a, b) => a.date - b.date)

        console.log(sortedValue, "sortedValue COMPLETE!!!!!!!!!!!!!!!!!!")
        resp.status(200).json({ result: true, message: sortedValue })
    } catch (e) {
        console.log(e.message)
    }
})

//평점 가져오기 (수정중)
router.post("/requestProductReview", async (req, resp) => {
    try {
        const id = req.body.productId;
        const response = await Product.findOne({ key: req.body.productId }).select('review').lean();
        const review = response?.review
        console.log(response);
        resp.status(200).json({ result: true, message: review });
    } catch (e) {
        console.log(e.message)
    }
})

router.post("/requestQnaAdd", async (req, resp) => {
    try {

        console.log(req.body)
        const { qna, productId, userId } = req.body

        if (!qna || !productId || !userId) {
            return resp.status(401).json({ result: false });
        }
        const origin = await Product.findOne({ key: productId }).select("QnA").lean()


        const updateProduct = await Product.findOneAndUpdate({ key: productId }, {
            "QnA": [...origin.QnA, {
                writer: userId,
                question: qna,
                answer: false,
                questionDate: Date.now()
            }]
        }, {
            returnDocument: "after"
        });
        //나중에 findOneAndUpdate 써서 answer업데이트하기


        if (updateProduct) {
            return resp.status(200).json({ result: true, updateProduct: updateProduct });
        }
        resp.status(401).json({ result: false });

    } catch (e) {


        resp.status(401).json({ result: false });
    }

})


module.exports = router;
