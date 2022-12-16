const { default: mongoose } = require("mongoose");
//_id 필요
const QnASchema = new mongoose.Schema(
    {
        QuestionTitle: String,
        QuestionContent: String,
        QuestionConsumer: String,
        AnswerContent: String,
        AnswerSeller: String,
        createdAt: Date
    }
);



const productSchema = new mongoose.Schema({
    SellerId: String, //판매자 아이디 유니크                    O
    Status: String, //제품 상태  / 셀렉트                      O
    Image: String, // 대표이미지 / 인풋                         O
    SubImage: [], // 서브이미지
    SKU: String, // 단위 프라이머리 키 uuid                     O
    Name: String, //상품명 / 인풋                              O
    Created: Date, // 등록일                                   O
    Available: String, // 활성화 / 셀렉트                      O
    FeePerSold: Number, // 수수료                             O
    Price: Number, // 가격 /인풋                               O
    FinalPrice: Number,
    ProductQuantity: Number, //최대판매가능한 상품 수량 /인풋    O
    MinimumQuantity: Number, //할인율을 적용하기위한 최소판매수량
    SoldQuantity: { type: Number, default: 0 },
    Deadline: Date,
    DiscountRate: String, //최대할인율
    Category: String, //상품 카테고리 /셀렉트                   O
    MadeIn: String, //상품생산국  / 인풋                        O
    Description: String, //상품 상세설명 / 인풋                 O
    Review: [{
        ReviewTitle: String, //제목
        ConsumerId: String,//소비자아이디
        ReviewContent: String,//리뷰 내용
        ReviewPhoto: [], //리뷰사진
        createdAt: Date //등록일
    }],
    QnA: [QnASchema]
});
module.exports = mongoose.model("Product", productSchema);