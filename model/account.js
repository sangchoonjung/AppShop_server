const { default: mongoose } = require("mongoose");

const accountScema = new mongoose.Schema({
    id: {type : String, unique : true, required:true},
    passWord: String,
    email: {type : String, unique : true, required:true},
    birth: String,
    // birth:Number,
    question: String,
    answer: String,
    
});
module.exports =  mongoose.model("account", accountScema);