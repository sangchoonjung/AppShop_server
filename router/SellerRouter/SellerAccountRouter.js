const express = require("express");
const jwt = require("jsonwebtoken");
const SellerAccount = require("../../model/SellerModel/SellerAccount");
const bcrypt = require("../../bcrypt/bcrypt.js");
const router = express.Router();

//로그인하기
router.post("/SellerLogin", async (req, resp) => {
    console.log(req.body, "sssssssss");
    try {
        if (req.body.email && req.body.password) {
            let auth = false;
            const data = await SellerAccount.findOne({ email: req.body.email });
            data
                ? (auth = await bcrypt.check(req.body.password, data.passWord))
                : (auth = false);

            if (auth) {
                const token = jwt.sign({ email: data.email }, process.env.SECRET_KEY, {
                    expiresIn: "7d",
                });
                // console.log(token);
                return resp.status(200).json({ result: true, message: data, token });
            } else {
                return resp.status(401).json({ result: false, message: "인증오류" });
            }
        }
    } catch (e) {
        return resp.status(401).json({ result: false });
    }
});

const chkEMail =
    /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

//계정등록
router.post("/SellerRegister", async (req, resp) => {
    // console.log(req.body, "체크");
    console.log(req.body)
    try {
        if (req.body.email && chkEMail.test(req.body.email)) {
            const hash = await bcrypt.hash(req.body.password);

            const response = await SellerAccount.create({ ...req.body, passWord: hash, createdAt: new Date() });
            // console.log(response)
            return resp.status(201).json({ result: true, message: response });
        } else {
            return resp.status(401).json({ result: false, message: "e-mail Error" });
        }
    } catch (e) {
        if (e.message.includes("email")) {
            return resp.status(401).json({ result: false, message: "중복된 이메일" });
        }
        resp.status(400).json({ result: false, message: "error" });
    }
});

//아이디체크
router.post("/SellerIdCheck", async (req, resp) => {
    console.log(req.body.email);
    try {
        const response = await SellerAccount.findOne({ email: req.body.email });
        console.log(response, "ssssssssssss");
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

router.post("/valid", async (req, res) => {
    console.log(req.body.token);

    try {
        jwt.verify(req.body.token, 'secret-key', (error, decoded) => {
            if (error) {
                console.log(`에러가 났습니다\n ${error}`);
                return res.status(401).json({ result: false });
            }
            console.log(decoded);
            return res.status(200).json({ result: true, message: decoded });
        })
    } catch (e) {
        console.log(e);
    }
})



module.exports = router;
