const { default: mongoose } = require("mongoose");

const accountScema = new mongoose.Schema({
    id: {type : String, unique : true, required:true},
    passWord: String,
    email: {type : String, unique : true, required:true},
    birth: String,
    // birth:Number,
    question: String,
    answer: String,
    zzimList: { type: Array,default:[] },
    productPendingItem: { type: Array, default: [] },
    productCompleteItem:{type:Array,default:[]}
    
});
module.exports =  mongoose.model("account", accountScema);