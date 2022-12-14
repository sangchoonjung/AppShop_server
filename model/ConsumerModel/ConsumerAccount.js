const { default: mongoose } = require("mongoose");

const accountSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    passWord: String,
    phoneNumber: String,
    birth: String,
    nickName: String,
    zzimList: [{ date: Number, id: String }],
    productPendingItem: { type: Array, default: [] },
    productCompleteItem: { type: Array, default: [] },
    completeReview: { type: Array, default: [] }

});
module.exports = mongoose.model("ConsumerAccount", accountSchema);