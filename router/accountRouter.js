const express = require('express');
const jwt = require("jsonwebtoken")
const Account = require("../model/account");
const bcrypt = require("../bcrypt/bcrypt.js")

const router = express.Router();


router.post("/login", async (req, resp) => {
    console.log(req.body);

    try {
        if (req.body.id && req.body.passWord) {
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

        // }else{
        // resp.json({ result: false, message: "register failed" });
        // }
    } catch (e) {
        console.log(e.message, "error")
        resp.status(401).json({ result: false, message: "error" });
    }
});


router.post("/idCheck",async (req,resp)=>{
    //아이디체크
    console.log(req.body.id)
    try{

        const response = await Account.findOne({id:req.body.id})
        if(response===null){
            //아이디가 없음(null)이면 result true
            resp.status(200).json({result:true})
        }else{
            //아이디가 있음(data)이면 result false
            resp.status(200).json({result:false})
        }
    }catch(e){
        resp.status(401).json({ result: false});

    }
});

//아이디 찾기
router.post("/findId",async(req,resp)=>{
    console.log(req.body)
try{
    const response = await Account.findOne({email:req.body.email});
    console.log(response)
    if(response){
        resp.status(200).json({result:true,id:response.id})
    }else{
        resp.status(200).json({result:false,id:"미가입"})
    }
}catch(e){
    console.log(e.message)
    resp.status(401).json({ result: false});
}

});


//비밀번호 재설정 (일단 경로만 설정)
router.post("/resetPassWord", async(req,resp)=>{

});

//개인정보 변경
router.post("/updateAccount", async(req,resp)=>{

});

module.exports = router;