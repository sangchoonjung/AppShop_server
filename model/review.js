const { default: mongoose } = require("mongoose");

const reviewSchema = new mongoose.Schema({
    content: Object,
    image: String,
    id:String

})

module.exports =  mongoose.model("review", reviewSchema);
