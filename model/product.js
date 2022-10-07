const { default: mongoose } = require("mongoose");

const productSchema = new mongoose.Schema({
    key: { type: Number, unique: true, required: true },
    from: String,
    "Delivery method": String,
    category: String,
    title: String,
    standardFee: Number,
    titleImage: String,
    detailImage: String,
    review: { type: Array, default: [] },
    QnA: { type: Array, default: [] }
});
module.exports = mongoose.model("product", productSchema);