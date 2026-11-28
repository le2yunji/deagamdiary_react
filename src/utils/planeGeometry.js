/** 이미지 원본 비율을 유지하면서 주어진 월드 너비에 맞는 높이를 계산한다. */
export const getAspectFitHeight = (worldWidth, imageWidth, imageHeight) =>
  worldWidth * (imageHeight / imageWidth);
