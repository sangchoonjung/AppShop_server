const { default: mongoose } = require("mongoose");

const accountSchema = new mongoose.Schema({
    id: String,
    email: { type: String, unique: true, required: true },
    passWord: String,
    phoneNumber: String,
    birth: String,
    zzimList: [{ date: Number, id: String }],
    productPendingItem: { type: Array, default: [] },
    productCompleteItem: { type: Array, default: [] },
    completeReview: { type: Array, default: [] }

});
module.exports = mongoose.model("ConsumerAccount", accountSchema);