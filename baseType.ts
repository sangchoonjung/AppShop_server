import mongoose from "mongoose";

export type seller = {
  SellerId: string; //판매자 아이디 유니크
  Status: string; //제품 상태  / 셀렉트
  Image: []; // 대표이미지 / 인풋
  SKU: number; // 단위 프라이머리 키 uuid
  Name: string; //상품명 / 인풋
  Created: Date; // 등록일
  Available: string; // 활성화 / 셀렉트
  FeePerSold: number; // 수수료
  Price: number; // 가격 /인풋
  Category: string; //상품 카테고리 /셀렉트
  MadeIn: string; //상품생산국  / 인풋
  ProductQuantity: number; //상품 수량 /인풋
  Description: []; //상품 상세설명 / 인풋
  QnA?: [
    {
      QustionUserId: string;
      Question: string;
      SellerUserId: string;
      Answer: string;
      registrationDate: Date; //등록일
    }
  ];
  review?: [
    {
      title: string; //제목
      consumerId: string; //소비자아이디
      reviewContent: string; //리뷰 내용
      reviewPhoto: string[]; //리뷰사진
      registrationDate: Date; //등록일
    }
  ];
  _id: mongoose.ObjectId;
};
