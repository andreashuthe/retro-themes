// Run with: npm test   (grammar based checks need a VS Code in .vscode-test/: npm run test:vscode – skipped otherwise)
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { build, themeFile, PALETTES } = require('../scripts/build');
const { resolve } = require('../scripts/roles');
const { contrast } = require('./contrast');
const { colorize, vscodeExtensionsDir } = require('./colorize');

const root = path.join(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const read = p => JSON.parse(fs.readFileSync(themeFile(p), 'utf8'));
/** alpha color blended onto bg */
const blend = (c, bg) => {
  if (c.length !== 9) return c;
  const a = parseInt(c.slice(7), 16) / 255;
  return '#' + [1, 3, 5].map(i => Math.round(parseInt(c.slice(i, i + 2), 16) * a + parseInt(bg.slice(i, i + 2), 16) * (1 - a)).toString(16).padStart(2, '0')).join('').toUpperCase();
};

test('every palette is contributed in package.json and generated', () => {
  assert.deepEqual(
    pkg.contributes.themes.map(t => [t.label, t.path, t.uiTheme]),
    PALETTES.map(p => [p.label, `./themes/${p.id}-color-theme.json`, p.type === 'dark' ? 'vs-dark' : 'vs']),
  );
  for (const p of PALETTES) assert.deepEqual(read(p), JSON.parse(JSON.stringify(build(p))), `run "npm run build" (${p.id})`);
});

test('all colors are valid hex values', () => {
  for (const p of PALETTES) {
    const t = read(p);
    for (const [k, c] of Object.entries(t.colors)) assert.match(c, /^#[0-9A-F]{6}([0-9A-F]{2})?$/, `${p.id}: ${k}`);
    for (const r of t.tokenColors) assert.match(r.settings.foreground, /^#[0-9A-F]{6}$/, `${p.id}: ${r.name}`);
    for (const [k, s] of Object.entries(t.semanticTokenColors)) if (s.foreground) assert.match(s.foreground, /^#[0-9A-F]{6}$/, `${p.id}: ${k}`);
  }
});

// "Original, but readable": WCAG AA (4.5) for code, a little less for comments and secondary UI text.
const SYNTAX = ['text', 'keyword', 'string', 'escape', 'number', 'function', 'call', 'type', 'typeParameter', 'field', 'constant', 'annotation', 'builtin', 'self', 'tag', 'attribute', 'regexp', 'operator'];
for (const p of PALETTES) {
  test(`${p.label}: code is readable (contrast)`, () => {
    const bg = read(p).colors['editor.background'];
    for (const role of SYNTAX) assert.ok(contrast(resolve(p.syntax, role).foreground, bg) >= 4.5, `${role}: ${contrast(resolve(p.syntax, role).foreground, bg).toFixed(2)}`);
    for (const role of ['comment', 'docComment']) assert.ok(contrast(resolve(p.syntax, role).foreground, bg) >= 4, `${role}`);
  });

  test(`${p.label}: UI text is readable (contrast)`, () => {
    const c = read(p).colors;
    const pairs = [
      ['sideBar', 'sideBar.foreground', 'sideBar.background', 4.5],
      ['section header', 'sideBarSectionHeader.foreground', 'sideBarSectionHeader.background', 4.5],
      ['status bar', 'statusBar.foreground', 'statusBar.background', 4.5],
      ['title bar', 'titleBar.activeForeground', 'titleBar.activeBackground', 4.5],
      ['list selection', 'list.activeSelectionForeground', 'list.activeSelectionBackground', 4.5],
      ['active tab', 'tab.activeForeground', 'tab.activeBackground', 4.5],
      ['inactive tab', 'tab.inactiveForeground', 'tab.inactiveBackground', 3],
      ['activity bar', 'activityBar.foreground', 'activityBar.background', 4.5],
      ['activity bar inactive', 'activityBar.inactiveForeground', 'activityBar.background', 3],
      ['widgets', 'editorWidget.foreground', 'editorWidget.background', 4.5],
      ['quick input', 'quickInput.foreground', 'quickInput.background', 4.5],
      ['menu', 'menu.foreground', 'menu.background', 4.5],
      ['menu selection', 'menu.selectionForeground', 'menu.selectionBackground', 4.5],
      ['button', 'button.foreground', 'button.background', 4.5],
      ['input', 'input.foreground', 'input.background', 4.5],
      ['badge', 'badge.foreground', 'badge.background', 4.5],
      ['remote', 'statusBarItem.remoteForeground', 'statusBarItem.remoteBackground', 4.5],
      ['panel', 'panelTitle.activeForeground', 'panel.background', 4.5],
      ['terminal', 'terminal.foreground', 'terminal.background', 4.5],
      ['line numbers', 'editorLineNumber.foreground', 'editor.background', 3],
      ['current line number', 'editorLineNumber.activeForeground', 'editor.background', 4.5],
    ];
    for (const [name, f, b, min] of pairs) assert.ok(contrast(c[f], c[b]) >= min, `${name}: ${contrast(c[f], c[b]).toFixed(2)} < ${min}`);
    // text stays readable inside a selection and on the current line
    const bg = c['editor.background'];
    assert.ok(contrast(c['editor.foreground'], blend(c['editor.selectionBackground'], bg)) >= 3.5, 'selected text');
    assert.ok(contrast(c['editor.foreground'], blend(c['editor.lineHighlightBackground'], bg)) >= 4.5, 'current line');
  });
}

// Grammar based: the main roles really reach the tokens of each language
const extDir = vscodeExtensionsDir(root);
const SAMPLES = {
  java: ['EntityRepositoryDao.java', { keyword: 'public', string: 'entityRepository', number: '100', comment: 'TODO: use a cache here', function: 'contains' }],
  typescript: ['service.ts', { keyword: 'export', function: 'helper', call: 'log' }],
  python: ['orders.py', { keyword: 'def', function: 'total', string: '42', comment: 'sum up all items' }],
  go: ['order.go', { keyword: 'func', function: 'Total' }],
  rust: ['order.rs', { keyword: 'fn', function: 'total' }],
  cpp: ['order.cpp', { function: 'total' }],
};
for (const p of PALETTES) {
  test(`${p.label}: languages use the palette`, { skip: !extDir && 'no VS Code in .vscode-test (npm run test:vscode)' }, async () => {
    for (const [lang, [file, expected]] of Object.entries(SAMPLES)) {
      const tokens = await colorize(themeFile(p), lang, fs.readFileSync(path.join(__dirname, 'samples', file), 'utf8'));
      for (const [role, text] of Object.entries(expected)) {
        const t = tokens.find(x => x.text === text);
        assert.ok(t, `${lang}: token ${text} not found`);
        const want = resolve(p.syntax, role);
        assert.equal(t.fg, want.foreground.toUpperCase(), `${lang}: ${role} "${text}"`);
        assert.equal(t.style, want.fontStyle, `${lang}: style of ${role} "${text}"`);
      }
    }
  });
}
