const { default: mongoose } = require("mongoose");

//_id 생성해야해서 QnA 스키마 따로 만들어서 넣음
const QnASchema = new mongoose.Schema({
    QustionUserId: String,
    Question: String,
    SellerUserId: String,
    Answer: String,
    registrationDate: Date //등록일
});

const productSchema = new mongoose.Schema({
    SellerId: String, //판매자 아이디 유니크
    Status: String, //제품 상태  / 셀렉트
    Image: [], // 대표이미지 / 인풋
    SKU: String, // 단위 프라이머리 키 uuid
    Name: String, //상품명 / 인풋
    Created: Date, // 등록일
    Available: String, // 활성화 / 셀렉트
    FeePerSold: Number, // 수수료
    Price: Number, // 가격 /인풋
    Category: String, //상품 카테고리 /셀렉트
    MadeIn: String, //상품생산국  / 인풋
    ProductQuantity: Number, //상품 수량 /인풋
    Description: [], //상품 상세설명 / 인풋
    QnA: [
        QnASchema
    ],
    review: [
        {
            title: String, //제목
            consumerId: String, //소비자아이디
            reviewContent: String, //리뷰 내용
            reviewPhoto: [], //리뷰사진
            registrationDate: Date //등록일
        }
    ]
});
module.exports = mongoose.model("product", productSchema);