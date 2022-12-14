const { default: mongoose } = require("mongoose");
//_id 필요
const QnASchema = new mongoose.Schema({
    QuestionTitle: String,
    QuestionContent: String,
    QuestionConsumer: String,
    AnswerContent: String,
    AnswerSeller: String,
    createdAt: Date
});



const productSchema = new mongoose.Schema({
    SellerId: String, //판매자 아이디 유니크
    Status: String, //제품 상태  / 셀렉트
    Image: [], // 대표이미지 / 인풋
    SKU: Number, // 단위 프라이머리 키 uuid
    Name: String, //상품명 / 인풋
    Created: Date, // 등록일
    Available: String, // 활성화 / 셀렉트
    FeePerSold: Number, // 수수료
    Price: Number, // 가격 /인풋
    Category: String, //상품 카테고리 /셀렉트
    MadeIn: String, //상품생산국  / 인풋
    ProductQuantity: Number, //상품 수량 /인풋
    Description: String, //상품 상세설명 / 인풋
    review: [{
        ReviewTitle: String, //제목
        ConsumerId: String,//소비자아이디
        ReviewContent: String,//리뷰 내용
        ReviewPhoto: [], //리뷰사진
        createdAt: Date //등록일
    }],
    QnA: QnASchema
});
module.exports = mongoose.model("Product", productSchema);