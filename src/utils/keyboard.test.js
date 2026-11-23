import { shouldPreventPageScroll } from './keyboard';

describe('shouldPreventPageScroll', () => {
  test.each(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', ' '])(
    '%p 키는 브라우저 기본 스크롤을 막는다',
    (key) => {
      expect(shouldPreventPageScroll(key)).toBe(true);
    },
  );

  test('장면 조작과 관계없는 키는 기본 동작을 유지한다', () => {
    expect(shouldPreventPageScroll('Tab')).toBe(false);
  });
});
