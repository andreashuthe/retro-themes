# Changelog

All notable changes to this extension are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), versions follow [Semantic Versioning](https://semver.org/).

Add new entries under **Unreleased** — the release workflow turns that section into the new version
and uses it as the GitHub release notes.

## [Unreleased]

### Added
- Six new themes: **Green Phosphor** and **Amber Phosphor** (monochrome monitors), **Pocket Green** (Game Boy),
  **Mode 1** (Amstrad / Schneider CPC 464), **Page 100** (Teletext / Videotext) and **Black Cube** (NeXTSTEP).
- Bonus theme **Ocean Drive**: neon sunset colors (pink, turquoise, orange, gold on violet).
- Recommended fonts and settings for the new themes in the README.

### Fixed
- TypeScript/JavaScript: function and method declarations use the theme's declaration color; calls inside methods
  no longer do.

## [1.0.0] - 2026-11-17

### Added
- Eight themes: **Breadbin 64** (C64), **Topaz 1.3** (Amiga Workbench 1.3), **Blue Commander** (Norton Commander),
  **Turbo Blue** (Turbo Pascal 7), **Green Desktop** (Atari ST), **Platinum** (Mac OS 8/9), **Program Manager**
  (Windows 3.1) and **Luna Blue** (Windows XP).
- Original palettes, lightened where needed – every theme is tested for readable contrast (code ≥ 4.5:1).
- Syntax roles for all common languages, semantic highlighting, terminal colors, VS Code's modern layout.
- README with free retro fonts and editor settings for each theme.
