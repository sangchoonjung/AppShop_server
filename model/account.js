const { default: mongoose } = require("mongoose");

const accountScema = new mongoose.Schema({
    id: String,
    passWord: String,
    email: String,
    birth: String,
    question: String,
    answer: String,
    
})
export default mongoose.model("account", accountScema);