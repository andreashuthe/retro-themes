/**
 * Takes the README screenshots in a real VS Code (docs/<theme>.png), each with the recommended font.
 *
 *   npm i --no-save playwright @vscode/test-electron
 *   xvfb-run -a node scripts/screenshots.js [theme-id]     # Linux; on macOS just `node scripts/screenshots.js`
 */
const { _electron } = require('playwright');
const fs = require('fs');
const os = require('os');
const path = require('path');
const PALETTES = require('./palettes');
const FONTS = require('./fonts');

const root = path.resolve(__dirname, '..');
const samples = path.join(root, 'test', 'samples');
const out = path.join(root, 'docs');
const W = 1440;
const H = 860;
const sleep = ms => new Promise(r => setTimeout(r, ms));

/** Sample file shown per theme */
const SAMPLE = {
  'breadbin-64': 'orders.py',
  'topaz-13': 'app.js',
  'blue-commander': 'order.go',
  'turbo-blue': 'order.cpp',
  'green-desktop': 'order.rs',
  platinum: 'service.ts',
  'program-manager': 'OrderService.php',
  'luna-blue': 'EntityRepositoryDao.java',
  'green-phosphor': 'order.go',
  'amber-phosphor': 'orders.py',
  'pocket-green': 'app.js',
  'mode-1': 'EntityRepositoryDao.java',
  'page-100': 'service.ts',
  'black-cube': 'order.cpp',
  'ocean-drive': 'service.ts',
};

async function vscodePath() {
  if (process.env.VSCODE_PATH) return process.env.VSCODE_PATH;
  const { downloadAndUnzipVSCode } = require('@vscode/test-electron');
  return downloadAndUnzipVSCode('stable');
}

async function shoot(p) {
  const file = SAMPLE[p.id];
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'retro-'));
  const userData = path.join(tmp, 'user');
  fs.mkdirSync(path.join(userData, 'User'), { recursive: true });
  const settingsFile = path.join(userData, 'User', 'settings.json');
  const settings = {
    'workbench.colorTheme': p.label,
    'workbench.startupEditor': 'none',
    'workbench.tips.enabled': false,
    'workbench.secondarySideBar.defaultVisibility': 'hidden',
    'chat.disableAIFeatures': true,
    'window.commandCenter': true,
    'window.title': '${activeEditorShort} — shop',
    'editor.minimap.enabled': false,
    'editor.stickyScroll.enabled': false,
    'editor.fontLigatures': false,
    'breadcrumbs.enabled': false,
    'git.enabled': false,
    'telemetry.telemetryLevel': 'off',
    'update.mode': 'none',
    'workbench.editor.enablePreview': false,
    'explorer.openEditors.visible': 0,
    'editor.bracketPairColorization.enabled': false,
    ...FONTS[p.id].settings,
  };
  const { 'workbench.colorTheme': _theme, ...initial } = settings;
  fs.writeFileSync(settingsFile, JSON.stringify(initial));
  const app = await _electron.launch({
    executablePath: await vscodePath(),
    args: [
      '--no-sandbox', '--disable-gpu', '--disable-workspace-trust', '--skip-welcome', '--skip-release-notes',
      `--user-data-dir=${userData}`, `--extensions-dir=${path.join(tmp, 'ext')}`, `--extensionDevelopmentPath=${root}`,
      samples, path.join(samples, file),
    ],
  });
  const w = await app.firstWindow();
  await w.setViewportSize({ width: W, height: H });
  await sleep(6000);
  // VS Code (1.145+) starts with the first theme of an extension under development – set the theme afterwards
  fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 1));
  await sleep(7000); // language servers: semantic tokens
  for (let i = 0; i < 3; i++) {
    await w.keyboard.press('Escape');
    await sleep(200);
  }
  await w.evaluate(() => {
    const s = document.createElement('style');
    s.textContent = '.notifications-toasts,.notification-toast-container{display:none!important}';
    document.head.appendChild(s);
  });
  // put the caret into a method so the current line shows
  const target = await w.evaluate(() => {
    const line = [...document.querySelectorAll('.editor-instance .view-line')].find(l => /public void lock|def total|total\(|Total\(|fn total|function total/.test(l.textContent.replace(/ /g, ' ')));
    if (!line) return null;
    const b = line.getBoundingClientRect();
    return { x: b.x + 200, y: b.y + b.height / 2 };
  });
  if (target) await w.mouse.click(target.x, target.y);
  await w.mouse.move(W - 5, H - 5);
  await sleep(2500);
  await w.evaluate(() => {
    const walk = document.createTreeWalker(document.querySelector('.part.titlebar') ?? document.body, NodeFilter.SHOW_TEXT);
    for (let n; (n = walk.nextNode());) n.textContent = n.textContent.replace(/\s*\[(Extension Development Host|Superuser)\]\s*/g, ' ').trim();
  });
  await sleep(300);
  const png = path.join(out, `${p.id}.png`);
  await w.screenshot({ path: png, clip: { x: 0, y: 0, width: W, height: H } });
  await app.close();
  console.log('wrote', path.relative(root, png));
}

(async () => {
  fs.mkdirSync(out, { recursive: true });
  const only = process.argv[2];
  for (const p of PALETTES) if (!only || p.id === only) await shoot(p);
})().catch(e => {
  console.error(e);
  process.exit(1);
});
