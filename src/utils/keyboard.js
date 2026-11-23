const PAGE_SCROLL_KEYS = new Set([
  'ArrowUp',
  'ArrowDown',
  'PageUp',
  'PageDown',
  ' ',
]);

export function shouldPreventPageScroll(key) {
  return PAGE_SCROLL_KEYS.has(key);
}
