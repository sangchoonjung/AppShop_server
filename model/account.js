const { default: mongoose } = require("mongoose");

const accountSchema = new mongoose.Schema({
    id: {type : String, unique : true, required:true},
    passWord: String,
    email: {type : String, unique : true, required:true},
    birth: String,
    // birth:Number,
    question: String,
    answer: String,
    zzimList: [{date:Number,id:String}],
    productPendingItem: { type: Array, default: [] },
    productCompleteItem:{type:Array,default:[]},
    completeReview :{type:Array,default:[]}
    
});
module.exports =  mongoose.model("account", accountSchema);