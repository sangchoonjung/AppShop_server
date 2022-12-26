const express = require('express');
const jwt = require('jsonwebtoken');
const ConsumerAccount = require('../../model/ConsumerModel/ConsumerAccount');
const bcrypt = require('../../bcrypt/bcrypt.js');
const router = express.Router();
const Product = require('../../model/commonModel/Product');
//로그인하기
router.post('/ConsumerLogin', async (req, resp) => {
    console.log(req.body, 'sssssssss');
    try {
        if (req.body.id && req.body.passWord) {
            let auth = false;
            const data = await ConsumerAccount.findOne({
                id: req.body.id,
            });
            const {
                id,
                email,
                productPendingItem,
                productCompleteItem,
                completeReview,
                zzimList,
                birth,
            } = data;
            data
                ? (auth = await bcrypt.check(req.body.passWord, data.passWord))
                : (auth = false);

            if (auth) {
                const token = jwt.sign(
                    { id: data.id },
                    process.env.SECRET_KEY,
                    {
                        expiresIn: 60 * 60 * 12,
                    }
                );
                // console.log(token);
                resp.status(200).json({
                    result: true,
                    message: {
                        id,
                        email,
                        productPendingItem,
                        productCompleteItem,
                        completeReview,
                        zzimList,
                        birth,
                    },
                    token,
                });
            } else {
                resp.json({ result: false });
            }
        }
    } catch (e) {
        resp.status(401).json({ result: false });
    }
});

const chkEMail =
    /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
//계정등록
router.post('/ConsumerRegister', async (req, resp) => {
    // console.log(req.body, "체크");
    try {
        if (req.body.email && chkEMail.test(req.body.email)) {
            const hash = await bcrypt.hash(req.body.passWord);
            // console.log(hash)
            const response = await ConsumerAccount.create({
                ...req.body,
                passWord: hash,
            });
            // console.log(response)
            resp.status(201).json({ result: true, message: response });
        } else {
            resp.status(401).json({
                result: false,
                message: 'register failed, Non E-mail.',
            });
        }
    } catch (e) {
        // console.log(e.message, "error")
        if (e.message.includes('email')) {
            return resp
                .status(401)
                .json({ result: false, message: '중복된 이메일' });
        }
        resp.status(400).json({ result: false, message: 'error' });
    }
});

//아이디체크
router.post('/ConsumerIdCheck', async (req, resp) => {
    console.log(req.body.id);
    try {
        const response = await ConsumerAccount.findOne({ id: req.body.id });
        console.log(response, '아이디 찾기 확인!!');
        if (response === null) {
            //아이디가 없음(null)이면 result true
            resp.status(200).json({ result: true });
        } else {
            //아이디가 있음(data)이면 result false
            resp.status(200).json({ result: false });
        }
    } catch (e) {
        resp.status(401).json({ result: false });
    }
});

//아이디 찾기
router.post('/ConsumerFindId', async (req, resp) => {
    console.log(req.body);
    try {
        const response = await ConsumerAccount.findOne({
            email: req.body.email,
        });
        console.log(response);
        if (response) {
            resp.status(200).json({ result: true, id: response.id });
        } else {
            resp.status(200).json({ result: false, id: '미가입' });
        }
    } catch (e) {
        console.log(e.message);
        resp.status(401).json({ result: false });
    }
});

//비밀번호 재설정
router.post('/ConsumerResetPassWord', async (req, resp) => {
    try {
        console.log(req.body);
        const response = await ConsumerAccount.findOne({ id: req.body.id });
        console.log(response, 'response');
        if (!response) {
            throw new Error('idNull');
        }
        if (
            response?.question === req.body?.question &&
            response?.answer === req.body?.answer
        ) {
            console.log('일치');
            const hash = await bcrypt.hash(req.body.passWord);
            const rst = await ConsumerAccount.findOneAndUpdate(
                { id: req.body.id },
                {
                    passWord: hash,
                },
                { returnDocument: 'after' }
            );
            return resp.status(200).json({ result: true, message: rst });
        }
        resp.status(200).json({ result: false });
    } catch (e) {
        console.log(e.message);
        if (e.message === 'idNull') {
            return resp
                .status(200)
                .json({ result: false, message: '정보없음' });
        }
        resp.status(401).json({ result: false });
    }
});

//개인정보 변경
router.post('/ConsumerUpdateConsumerAccount', async (req, resp) => {
    try {
        if (!req.body.passWordNow) {
            return;
        }
        console.log(req.body);
        let auth;
        const data = await ConsumerAccount.findOne({ id: req.body.id });
        data
            ? (auth = await bcrypt.check(req.body.passWordNow, data.passWord))
            : (auth = false);
        if (auth) {
            let newData;
            if (req.body.newPassWord) {
                const hash = await bcrypt.hash(req.body.newPassWord);
                newData = { ...req.body, passWord: hash };
            } else {
                newData = { ...req.body };
            }
            const response = await ConsumerAccount.findOneAndUpdate(
                {
                    id: req.body.id,
                },
                newData,
                { returnDocument: 'after' }
            );
            resp.status(200).json({ result: true, data: response });
        } else {
            resp.status(401).json({ message: 'Error', result: false });
        }
    } catch (e) {
        console.log(e.message);
    }
});

//pending 상품 받아서 수량 올리고 저장

router.post('/ConsumerPendingRequest', async (req, resp) => {
    try {
        const { id, productId, unit, price, date } = req.body;
        const reqToken = req.headers['x-access-token'] || req.body.token;
        if (!reqToken) {
            return resp.status(401).json({ message: 'token error' });
        }
        //토큰 유효성 검사
        const token = jwt.verify(reqToken, process.env.SECRET_KEY);
        if (token.id !== id) throw new Error('token id error');

        //상품 유효성 검사
        const targetProduct = await Product.findOne({ SKU: productId });
        if (
            targetProduct.length < 1 ||
            targetProduct.ProductQuantity < targetProduct.SoldQuantity + unit
            //최대 수량 < 팔린 수량 + 구매할 수량 이면 오류
        )
            return resp.status(401).json({ message: '잘못된 상품 정보' });
        const data = await ConsumerAccount.findOne({ id: id }).select(
            'productPendingItem'
        );
        let newData = [
            ...data.productPendingItem,
            { id, productId, unit, price, date, type: 'pending' },
        ];
        if (data.productPendingItem.some((i) => i.productId === productId)) {
            return resp.status(401).json({ message: '이미 펜딩햇음' });
        }
        const response = await ConsumerAccount.findOneAndUpdate(
            {
                id: id,
            },
            {
                productPendingItem: newData,
            },
            {
                returnDocument: 'after',
            }
        );
        // console.log(response.productPendingItem)
        // 바이어 펜딩 작업 끝

        //=======================================
        // 상품 수량 계산
        const rstQun = targetProduct.SoldQuantity + unit;
        await Product.findOneAndUpdate(
            { SKU: productId },
            { SoldQuantity: rstQun }
        );
        // 수량 계산 끝, 응답 보냄
        resp.status(200).json({
            result: true,
            message: response.productPendingItem,
        });
    } catch (e) {
        console.log(e.message);
        resp.status(401).json({ result: false });
    }
});

module.exports = router;
