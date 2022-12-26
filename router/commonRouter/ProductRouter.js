const express = require('express');
const ConsumerAccount = require('../../model/ConsumerModel/ConsumerAccount');
const Product = require('../../model/commonModel/Product');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { initializeApp } = require('firebase/app');
const formidable = require('formidable');
const fs = require('fs');
const {
    ref,
    getStorage,
    getDownloadURL,
    uploadBytes,
} = require('firebase/storage');
const { v4 } = require('uuid');

const firebaseConfig = {
    apiKey: 'AIzaSyBMe-x9IWvOnFLWjF1NpOlVctYmdiWR2bc',
    authDomain: 'app-shop-77741.firebaseapp.com',
    projectId: 'app-shop-77741',
    storageBucket: 'app-shop-77741.appspot.com',
    messagingSenderId: '122810812732',
    appId: '1:122810812732:web:ffab2b4a067b35d8893639',
    measurementId: 'G-4DQYR0W1X6',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//판매자 페이지============================================================
// 판매자 상품 올리기 api

router.post('/addProduct', async (req, res) => {
    const reqToken = req.headers['x-access-token'] || req.body.token;
    if (!reqToken) {
        return res.status(401).json({ message: 'token error' });
    }
    try {
        const token = jwt.verify(reqToken, process.env.SECRET_KEY);

        const form = formidable({ multiples: true });
        const result = await new Promise((resolve, rejsct) => {
            form.parse(req, (err, fields, files) => {
                resolve({
                    input: fields.input,
                    mainImage: files.mainImage,
                    subImage: files.subImage,
                });
            });
        });
        // console.log("메인 이미지 정보", result.mainImage);

        const storage = getStorage(app);
        const dirRef = ref(storage, 'mainImg/' + token.email);
        const fileRef = ref(dirRef, result.mainImage.newFilename);

        //메인이미지 스토리지 등록
        const mainFile = fs.readFileSync(result.mainImage.filepath);

        await uploadBytes(fileRef, mainFile, {
            //타입지정
            contentType: result.mainImage.mimetype,
        });

        await uploadBytes(fileRef, mainFile, {
            //타입지정
            contentType: result.mainImage.mimetype,
        });
        const mainImg = await getDownloadURL(fileRef);

        /*
        //서브이미지 스토리지 등록
        const subPhotoList = [];
        for (let one of result.subImage) {
            const fileRef = ref(dirRef, one.newFilename);
            const file = fs.readFileSync(one.filepath);
            await uploadBytes(fileRef, file, {
                //타입지정
                contentType: one.mimetype,
            });
            subPhotoList.push(await getDownloadURL(fileRef));
        }
        // console.log(subPhotoList);
        */
        //원래 코드

        const subPhotoList = await Promise.all(
            result.subImage.map(async (one) => {
                const fileRef = ref(dirRef, one.newFilename);
                const file = fs.readFileSync(one.filepath);
                await uploadBytes(fileRef, file, {
                    contentType: one.mimetype,
                });
                return await getDownloadURL(fileRef);
            })
        );
        //Promise all

        console.log(result.input, '넘어온 데이타');
        const getData = JSON.parse(result.input);
        // console.log(jwt.verify(reqToken, process.env.SECRET_KEY), "토큰sssssssssssssssss")
        const putData = {
            Name: getData.name,
            Category: getData.category,
            Price: Number(getData.price),
            ProductQuantity: Number(getData.amount),
            MadeIn: getData.country,
            Description: getData.description,
            Status: getData.status,
            MinimumQuantity: Number(getData.minimumAmount),
            Deadline: getData.deadline,
            DiscountRate: getData.discountRate,
            Created: new Date(),
            FeePerSold: Number(getData.price) * 0.1, //수수료
            SKU: v4(),
            Image: mainImg,
            SellerId: token.email,
            FinalPrice: Number(getData.price),
            SubImage: subPhotoList,
        };
        const response = await Product.create(putData);
        return res.status(200).json({ result: true, message: response });
    } catch (e) {
        res.status(500).json({ result: false, message: 'Server Error' });
    }
});

//판매자 상품리스트 불러오기
router.post('/getProductList', async (req, res) => {
    const reqToken = req.headers['x-access-token'] || req.body.token;
    console.log(reqToken, '토큰ㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴ');
    try {
        if (!reqToken) {
            return req.status(401).json({ message: 'token error' });
        }
        const token = jwt.verify(reqToken, process.env.SECRET_KEY);
        const response = await Product.find({ SellerId: token.email });
        return res.status(200).json({ result: true, message: response });
    } catch (e) {
        console.log(e.message);
        return res.status(401).json({ result: false, message: 'TOKEN ERROR' });
    }
});

// 소비자 페이지===========================================================
// 전체 상품 읽어오기 (완)
router.post('/allProductList', async (req, resp) => {
    console.log(req.body);

    try {
        const data = await Product.find();
        resp.status(200).json({ result: true, message: data });
    } catch (e) {
        resp.status(401).json({ result: false });
    }
});

//키워드검색 상품 읽어오기 (완)
router.post('/searchProductList', async (req, resp) => {
    const requestSearchItem = req.body.search;
    console.log(requestSearchItem);
    try {
        const data = await Product.find({
            Name: { $regex: String(requestSearchItem) },
        });
        resp.status(200).json({ result: true, message: data });
    } catch (e) {
        console.log(e);
        resp.status(500).json({ result: false });
    }
});

//카테고리 선정을 통한 상품 읽어오기 (완)
router.post('/categoryProductList', async (req, resp) => {
    try {
        const requestSearchItem = req.body.category;
        console.log(requestSearchItem, "카테고리");
        const data = await Product.find({
            Category: { $in: requestSearchItem },
        });
        resp.status(200).json({ result: true, message: data });
    } catch (e) {
        console.log(e);
        resp.status(500).json({ result: false });
    }
});

//찜리스트에서 상품 불러오기
router.post('/zzimProductList', async (req, resp) => {
    // console.log(req.body.zzimList, "req.body")

    try {
        const requestSearchItem = req.body.zzimList;
        const itemId = requestSearchItem.map((e) => {
            return e.id;
        });
        // console.log(itemId)
        const data = await Product.find({ key: { $in: itemId } }).lean();
        // console.log(data)
        if (!data) return resp.status(200).json({ result: true, message: [] });
        const sortedValue = data
            .map((e) => {
                const idx = requestSearchItem.findIndex(
                    (elm) => elm.id === e.key
                );
                return {
                    ...e,
                    date: requestSearchItem[idx].date,
                    zzimType: true,
                };
            })
            .sort((a, b) => a.date - b.date);

        console.log(sortedValue, 'sortedValue');
        resp.status(200).json({ result: true, message: sortedValue });
    } catch (e) {
        console.log(e.message);
    }
});

//pending
router.post('/requestProductList', async (req, resp) => {
    try {
        const requestSearchItem = req.body.list;
        if (!requestSearchItem)
            return resp
                .status(401)
                .json({ message: '잘못된 펜딩 목록입니다.' });
        const itemId = requestSearchItem.map((e) => {
            return e.productId;
        });
        // console.log(itemId, 'check 1 !!!!!!!!!!!!!!!!');
        const data = await Product.find({ SKU: { $in: itemId } }).lean();
        // console.log(data);
        if (!data)
            return resp
                .status(200)
                .json({ result: true, message: '잘못된 상품 정보입니다.' });
        // console.log(req.body.type)
        const sortedValue = data
            .map((e) => {
                const idx = requestSearchItem.findIndex(
                    (elm) => elm.productId === e.SKU
                );
                // console.log(idx, 'sangchoon check!!!!!!!!!!!!!');
                return {
                    ...e,
                    date: requestSearchItem[idx].date,
                    unit: requestSearchItem[idx].unit,
                    price: requestSearchItem[idx].price,
                    type: 'pending',
                };
            })
            .sort((a, b) => a.date - b.date);

        console.log(sortedValue, 'sortedValue PENDING!!!!!!!!!!!');
        console;
        resp.status(200).json({ result: true, message: sortedValue });
    } catch (e) {
        console.log(e.message);
    }
});
//pending 수량 수정
router.post('/requestProductFix', async (req, resp) => {
    try {
        console.log(req.body.id);
        const data = await ConsumerAccount.findOne({ id: req.body.id });
        // console.log(data)
        const origin = data.productPendingItem.map((e) => {
            if (e.key !== req.body.productId) {
                return e;
            }
        });
        console.log(origin);
        let newData = [...origin, { ...req.body }];
        const response = await ConsumerAccount.findOneAndUpdate(
            {
                id: req.body.id,
            },
            {
                productPendingItem: newData,
            },
            {
                returnDocument: 'after',
            }
        );
        // console.log(response.productPendingItem)
        resp.status(200).json({
            result: true,
            message: response.productPendingItem,
        });
    } catch (e) {
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
router.post('/requestProductListComplete', async (req, resp) => {
    try {
        const requestSearchItem = req.body.list;
        console.log(requestSearchItem);
        const itemId = requestSearchItem.map((e) => {
            return e.productId;
        });

        const data = await Product.find({ key: { $in: itemId } }).lean();
        // console.log(data)
        if (!data) return resp.status(200).json({ result: true, message: [] });
        console.log(req.body.type);
        const sortedValue = data
            .map((e) => {
                const idx = requestSearchItem.findIndex(
                    (elm) => elm.productId === e.key
                );
                return {
                    ...e,
                    date: requestSearchItem[idx].date,
                    unit: requestSearchItem[idx].unit,
                    price: requestSearchItem[idx].price,
                    type: req.body.type,
                };
            })
            .sort((a, b) => a.date - b.date);

        console.log(sortedValue, 'sortedValue COMPLETE!!!!!!!!!!!!!!!!!!');
        resp.status(200).json({ result: true, message: sortedValue });
    } catch (e) {
        console.log(e.message);
    }
});

//평점 가져오기 (수정중)
router.post('/requestProductReview', async (req, resp) => {
    try {
        const id = req.body.productId;
        const response = await Product.findOne({ key: req.body.productId })
            .select('review')
            .lean();
        const review = response?.review;
        console.log(response);
        resp.status(200).json({ result: true, message: review });
    } catch (e) {
        console.log(e.message);
    }
});

router.post('/requestQnaAdd', async (req, resp) => {
    try {
        console.log(req.body);
        const { qna, productId, userId } = req.body;

        if (!qna || !productId || !userId) {
            return resp.status(401).json({ result: false });
        }
        const origin = await Product.findOne({ key: productId })
            .select('QnA')
            .lean();

        const updateProduct = await Product.findOneAndUpdate(
            { key: productId },
            {
                QnA: [
                    ...origin.QnA,
                    {
                        writer: userId,
                        question: qna,
                        answer: false,
                        questionDate: Date.now(),
                    },
                ],
            },
            {
                returnDocument: 'after',
            }
        );
        //나중에 findOneAndUpdate 써서 answer업데이트하기

        if (updateProduct) {
            return resp
                .status(200)
                .json({ result: true, updateProduct: updateProduct });
        }
        resp.status(401).json({ result: false });
    } catch (e) {
        resp.status(401).json({ result: false });
    }
});

module.exports = router;
