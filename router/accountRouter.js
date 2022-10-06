const express = require('express');
const jwt = require("jsonwebtoken")
const Account = require("../model/account");
const bcrypt = require("../bcrypt/bcrypt.js")

const router = express.Router();


router.post("/login", async (req,resp)=>{
    console.log (req.body);
try{
if(req.body.id&&req.body.passWord){
const data = await Account.findOne({id:req.body.id});
data ? auth = await bcrypt.check(req.body.passWord, data.passWord) : auth = false;
if (auth) {
    const token = jwt.sign({ email: data.email }, process.env.SECRET_KEY, { expiresIn: 60 * 60 * 12 });

    resp.status(200).json({ result: true, message: data, token });

} else {
    resp.json({ result: false });
}

}

}catch(e){
        resp.status(401).json({ result: false });
}




});


const chkEMail = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

//계정등록
router.post("/register", async (req,resp)=>{
    console.log (req.body);
try{
    // if (req.body.email && chkEMail.test(req.body.email)) {
        //이메일 검증코드인데 일단 귀찮아서 주석처리
        const hash = await bcrypt.hash(req.body.passWord);
        console.log(hash)
        const response = await  Account.create({...req.body,passWord:hash});
        console.log(response)
        
    // }else{
        // resp.json({ result: false, message: "register failed" });
    // }
}catch(e){
    console.log(e.message, "error")
    resp.status.json({ result: false, message: "error" });
}
});


module.exports = router;