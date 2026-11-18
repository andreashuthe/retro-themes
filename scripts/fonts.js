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
  'green-phosphor': {
    font: 'Px437 IBM MDA',
    url: 'https://int10h.org/oldschool-pc-fonts/',
    license: 'The Ultimate Oldschool PC Font Pack by VileR, CC BY-SA 4.0',
    settings: { 'editor.fontFamily': "'Px437 IBM MDA', monospace", 'editor.fontSize': 18, 'editor.lineHeight': 22, 'editor.cursorStyle': 'block' },
  },
  'amber-phosphor': {
    font: 'Px437 IBM MDA',
    url: 'https://int10h.org/oldschool-pc-fonts/',
    license: 'The Ultimate Oldschool PC Font Pack by VileR, CC BY-SA 4.0',
    settings: { 'editor.fontFamily': "'Px437 IBM MDA', monospace", 'editor.fontSize': 18, 'editor.lineHeight': 22, 'editor.cursorStyle': 'underline' },
  },
  'pocket-green': {
    font: 'Press Start 2P',
    url: 'https://fonts.google.com/specimen/Press+Start+2P',
    license: 'SIL Open Font License',
    settings: { 'editor.fontFamily': "'Press Start 2P', monospace", 'editor.fontSize': 12, 'editor.lineHeight': 22, 'editor.cursorStyle': 'block' },
  },
  'mode-1': {
    font: 'Px437 Amstrad PC',
    url: 'https://int10h.org/oldschool-pc-fonts/',
    license: 'The Ultimate Oldschool PC Font Pack by VileR, CC BY-SA 4.0 (Amstrad PC1512 font – no maintained free CPC font exists)',
    settings: { 'editor.fontFamily': "'Px437 Amstrad PC', monospace", 'editor.fontSize': 16, 'editor.lineHeight': 20, 'editor.cursorStyle': 'block' },
  },
  'page-100': {
    font: 'Bedstead',
    url: 'https://bjh21.me.uk/bedstead/',
    license: 'public domain; also packaged as "fonts-bedstead" in Debian',
    settings: { 'editor.fontFamily': "Bedstead, 'Px437 IBM VGA 8x16', monospace", 'editor.fontSize': 16, 'editor.lineHeight': 20, 'editor.cursorStyle': 'block' },
  },
  'black-cube': {
    font: 'Courier Prime',
    url: 'https://fonts.google.com/specimen/Courier+Prime',
    license: "SIL Open Font License (NeXT's own Ohlfs isn't freely licensed)",
    settings: { 'editor.fontFamily': "'Courier Prime', Courier, monospace", 'editor.fontSize': 14, 'editor.lineHeight': 20 },
  },
  'ocean-drive': {
    font: 'Space Mono',
    url: 'https://fonts.google.com/specimen/Space+Mono',
    license: 'SIL Open Font License',
    settings: { 'editor.fontFamily': "'Space Mono', monospace", 'editor.fontSize': 14, 'editor.lineHeight': 22, 'editor.cursorStyle': 'line', 'editor.cursorBlinking': 'expand' },
  },
};
