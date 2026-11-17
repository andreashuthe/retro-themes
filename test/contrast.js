// WCAG 2 contrast ratio helpers
const lum = c => {
  const [r, g, b] = [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16) / 255).map(v => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
/** Contrast of fg on bg; an fg with alpha is blended onto bg first. */
function contrast(fg, bg) {
  let f = fg;
  if (fg.length === 9) {
    const a = parseInt(fg.slice(7), 16) / 255;
    const m = [1, 3, 5].map(i => Math.round(parseInt(fg.slice(i, i + 2), 16) * a + parseInt(bg.slice(i, i + 2), 16) * (1 - a)));
    f = '#' + m.map(v => v.toString(16).padStart(2, '0')).join('');
  }
  const [a, b] = [lum(f), lum(bg.slice(0, 7))].sort((x, y) => y - x);
  return (a + 0.05) / (b + 0.05);
}
module.exports = { contrast };
