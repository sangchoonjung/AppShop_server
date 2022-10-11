const express = require('express');
const jwt = require("jsonwebtoken")
const Account = require("../model/account");
const bcrypt = require("../bcrypt/bcrypt.js")

const router = express.Router();

//로그인하기
router.post("/login", async (req, resp) => {
    console.log(req.body);

    try {
        if (req.body.id && req.body.passWord) {
            let auth = false;
            const data = await Account.findOne({ id: req.body.id });
            data ? auth = await bcrypt.check(req.body.passWord, data.passWord) : auth = false;
            if (auth) {
                const token = jwt.sign({ email: data.email }, process.env.SECRET_KEY, { expiresIn: 60 * 60 * 12 });
                resp.status(200).json({ result: true, message: data, token });

            } else {
                resp.json({ result: false });
            }
        }

    } catch (e) {
        resp.status(401).json({ result: false });
    }


});


const chkEMail = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

//계정등록
router.post("/register", async (req, resp) => {
    console.log(req.body);
    try {

        // if (req.body.email && chkEMail.test(req.body.email)) {
        //이메일 검증코드인데 일단 귀찮아서 주석처리

        const hash = await bcrypt.hash(req.body.passWord);
        console.log(hash)
        const response = await Account.create({ ...req.body, passWord: hash });
        console.log(response)

        resp.status(201).json({result:true,message:response})
        // }else{
        // resp.json({ result: false, message: "register failed" });
        // }
    } catch (e) {
        console.log(e.message, "error")
        // console.log(e.message.includes("email"))
        if(e.message.includes("email")){
            return resp.status(401).json({result:false,message:"중복된 이메일"});
        }
        resp.status(400).json({ result: false, message: "error" });
    }
});


router.post("/idCheck", async (req, resp) => {
    //아이디체크
    console.log(req.body.id)
    try {

        const response = await Account.findOne({ id: req.body.id })
        if (response === null) {
            //아이디가 없음(null)이면 result true
            resp.status(200).json({ result: true })
        } else {
            //아이디가 있음(data)이면 result false
            resp.status(200).json({ result: false })
        }
    } catch (e) {
        resp.status(401).json({ result: false });

    }
});

//아이디 찾기
router.post("/findId", async (req, resp) => {
    console.log(req.body)

    try {
        const response = await Account.findOne({ email: req.body.email });
        console.log(response)
        if (response) {
            resp.status(200).json({ result: true, id: response.id })
        } else {
            resp.status(200).json({ result: false, id: "미가입" })
        }
    } catch (e) {
        console.log(e.message)
        resp.status(401).json({ result: false });
    }

});


//비밀번호 재설정 (일단 경로만 설정)
router.post("/resetPassWord", async (req, resp) => {
    try{
        console.log(req.body)
        const response = await Account.findOne({id:req.body.id});
        //질문이랑 비교해서 맞으면 update (아직안했음)
        console.log(response,"response")
        if(!response){
            throw new Error("idNull")
        }
        resp.status(200).json({ result: false })

    }catch(e){
        console.log(e.message)
        if(e.message === "idNull"){
            return resp.status(200).json({result:false,message:"정보없음"});
        }
        resp.status(401).json({ result: false });

    }
    
});

//개인정보 변경
router.post("/updateAccount", async (req, resp) => {

    try {
        if (!req.body.passWordNow) {
            return;
        }
        console.log(req.body)
        let auth;
        const data = await Account.findOne({ id: req.body.id });
        // console.log(data)
        data ? auth = await bcrypt.check(req.body.passWordNow, data.passWord) : auth = false;
        // console.log(auth)

        if (auth) {
            let newData;
            if (req.body.newPassWord) {
                const hash = await bcrypt.hash(req.body.newPassWord)
                newData = { ...req.body, passWord: hash }
            } else {
                newData = { ...req.body }
            }
            // console.log(newData.passWord)
            // console.log(newData)
            const response = await Account.findOneAndUpdate({
                id: req.body.id
            },
                newData
                , { returnDocument: "after" })
            // console.log(response)
            resp.status(200).json({ result: true, data: response });
        } else {
            resp.status(200).json({ message: "Error", result: false })
        }

    }
    catch (e) {
        console.log(e.message);
    }

});

module.exports = router;