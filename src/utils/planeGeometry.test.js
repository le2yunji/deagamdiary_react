import { getAspectFitHeight } from './planeGeometry';

describe('getAspectFitHeight', () => {
  test('원본 이미지 비율을 유지하는 월드 높이를 계산한다', () => {
    expect(getAspectFitHeight(400, 5000, 4167)).toBeCloseTo(333.36, 2);
  });
});
