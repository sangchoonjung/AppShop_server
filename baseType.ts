type seller = {
  SellerId: string; //판매자 아이디 유니크
  Status: string; //제품 상태
  Image: string; // 대표이미지
  SKU: number; // 단위 프라이머리 키 uuid
  Name: string; //상품명
  Created: Date; // 등록일
  Available: string; // 활성화
  FeePerSold: number; // 수수료
  Price: number; // 가격
  Category: string; //상품 카테고리
  MadeIn: string; //상품생산국
  ProductQuantity: number; //상품 수량
  Description: string; //상품 상세설명

  // ImageSub: SKU 기준으로 조인해서 연결하기 (타이틀 이미지 서브)              _id
  // ImageDetail : SKU 기준으로 조인해서 연결하기 (상세설명 이미지 서브)        _id
  // QnA: []; : SKU 기준으로 조인해서 연결하기 (질문답변리스트)           _id
  review: [
    //SKU 기준으로 조인해서 연결하기 (리뷰)              _id
    //리뷰
    {
      title: string; //제목
      consumerId: string; //소비자아이디
      reviewContent: string; //리뷰 내용
      reviewPhoto: string[]; //리뷰사진
      registrationDate: Date; //등록일
    }
  ];
  // _id: mongoose.ObjectId;
};
