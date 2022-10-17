const { default: mongoose } = require("mongoose");

const productSchema = new mongoose.Schema({
    key: { type: String, unique: true, required: true },
    from: String,
    "Delivery method": String,
    category: String,
    title: String,
    standardFee: Number,
    titleImage: String,
    detailImage: String,

    // review: { type: Array, default: [{rate:String,}] },
    // QnA: { type: Array, default: [] },
    review: [],
    QnA: []
});
module.exports = mongoose.model("product", productSchema);