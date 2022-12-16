const { default: mongoose } = require("mongoose");

const accountSchema = new mongoose.Schema({
    email: { type: String, required: true },
    passWord: String,
    phoneNumber: String,
    birth: String,
    nickName: String,
    salesList: [],
    createdAt: Date

});
module.exports = mongoose.model("SellerAccount", accountSchema);