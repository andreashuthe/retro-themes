// Recommended (free) fonts and editor settings per theme – used for the screenshots and listed in the README.
// Themes can't ship fonts; users install them separately.
module.exports = {
  'breadbin-64': {
    font: 'C64 Pro Mono',
    url: 'https://style64.org/c64-truetype',
    license: 'free download from Style (see their license)',
    settings: { 'editor.fontFamily': "'C64 Pro Mono', monospace", 'editor.fontSize': 16, 'editor.lineHeight': 24, 'editor.cursorStyle': 'block', 'editor.cursorBlinking': 'phase' },
  },
  'topaz-13': {
    font: 'Topaz (Kickstart 1.3)',
    url: 'https://github.com/rewtnull/amigafonts',
    license: 'GPL with font exception; also packaged as "fonts-topaz-unicode" in Debian/Ubuntu',
    family: 'Topaz a500a1000a2000',
    settings: { 'editor.fontFamily': "'Topaz a500a1000a2000', 'Topaz Unicode KS13', monospace", 'editor.fontSize': 16, 'editor.lineHeight': 22, 'editor.cursorStyle': 'block' },
  },
  'blue-commander': {
    font: 'Px437 IBM VGA 8x16',
    url: 'https://int10h.org/oldschool-pc-fonts/',
    license: 'The Ultimate Oldschool PC Font Pack by VileR, CC BY-SA 4.0',
    settings: { 'editor.fontFamily': "'Px437 IBM VGA 8x16', monospace", 'editor.fontSize': 16, 'editor.lineHeight': 20, 'editor.cursorStyle': 'block', 'editor.cursorBlinking': 'solid' },
  },
  'turbo-blue': {
    font: 'Px437 IBM VGA 8x16',
    url: 'https://int10h.org/oldschool-pc-fonts/',
    license: 'The Ultimate Oldschool PC Font Pack by VileR, CC BY-SA 4.0',
    settings: { 'editor.fontFamily': "'Px437 IBM VGA 8x16', monospace", 'editor.fontSize': 16, 'editor.lineHeight': 20, 'editor.cursorStyle': 'underline', 'editor.cursorBlinking': 'blink' },
  },
  'green-desktop': {
    font: 'Atari ST 8x16 system font',
    url: 'https://github.com/ntwk/atarist-font',
    license: 'BSD-3-Clause; also packaged as "fonts-atarist" in Debian/Ubuntu',
    family: 'Atari',
    settings: { 'editor.fontFamily': "'Atari', 'Atari ST', monospace", 'editor.fontSize': 16, 'editor.lineHeight': 20, 'editor.cursorStyle': 'block' },
  },
  platinum: {
    font: 'Monaco (preinstalled on macOS) or ProFont',
    url: 'https://tobiasjung.name/profont/',
    license: 'Monaco ships with macOS; ProFont is free',
    settings: { 'editor.fontFamily': "Monaco, ProFontWindows, ProFont, 'DejaVu Sans Mono', monospace", 'editor.fontSize': 13, 'editor.lineHeight': 18 },
  },
  'program-manager': {
    font: 'Fixedsys Excelsior',
    url: 'https://en.wikipedia.org/wiki/Fixedsys',
    license: 'free remake of the Windows 3.1 system font',
    settings: { 'editor.fontFamily': "'Fixedsys Excelsior 3.01', 'Fixedsys Excelsior', 'Liberation Mono', 'Courier New', monospace", 'editor.fontSize': 16, 'editor.lineHeight': 20 },
  },
  'luna-blue': {
    font: 'Lucida Console or Courier New (preinstalled on Windows)',
    url: '',
    license: 'ships with Windows',
    settings: { 'editor.fontFamily': "'Lucida Console', 'Courier New', 'Liberation Mono', monospace", 'editor.fontSize': 14, 'editor.lineHeight': 20 },
  },
};
