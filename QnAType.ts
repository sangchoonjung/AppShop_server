type qna = {
  //질의응답
  consumer: {
    //소비자
    title: string; //제목
    consumerId: string; //소비자아이디
    questionContent: string; //질문내용
    registrationDate: Date; //등록일
  };
  seller: {
    //판매자
    sellerId: string; //판매자 아이디
    answerContent: string; //답변내용
    registrationDate: Date; //등록일
  };
  productTarget: string;
  // _id: mongoose.ObjectId;
};
