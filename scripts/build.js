// Generates themes/<id>-color-theme.json for every palette in scripts/palettes.js.
//   node scripts/build.js
const fs = require('fs');
const path = require('path');
const { TOKENS, SEMANTIC } = require('./scopes');
const { roleOf, resolve } = require('./roles');
const PALETTES = require('./palettes');

const OUT = path.join(__dirname, '..', 'themes');

// ------------------------------------------------------------------------------------------- colors
const hex = c => c.toUpperCase();
const rgb = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
const toHex = a => '#' + a.map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('').toUpperCase();
/** "#RRGGBB" + alpha (0..1) → "#RRGGBBAA" */
const alpha = (c, a) => (a >= 1 ? hex(c.slice(0, 7)) : hex(c.slice(0, 7)) + Math.round(a * 255).toString(16).padStart(2, '0').toUpperCase());
/** a → b by t (0..1) */
const mix = (a, b, t) => toHex(rgb(a).map((v, i) => v + (rgb(b)[i] - v) * t));

// ------------------------------------------------------------------------------------------- syntax
function tokenColors(p) {
  return TOKENS.map(([name, scope, key]) => {
    const { foreground, fontStyle } = resolve(p.syntax, roleOf(key));
    // explicit "" resets italics/bold inherited from broader rules
    return { name, scope, settings: { foreground: hex(foreground), fontStyle } };
  });
}

function semanticTokenColors(p) {
  const out = {};
  for (const [sel, key] of SEMANTIC) {
    const { foreground, fontStyle } = resolve(p.syntax, roleOf(key));
    const r = { foreground: hex(foreground), italic: fontStyle.includes('italic'), bold: fontStyle.includes('bold') };
    if (fontStyle.includes('underline')) r.underline = true;
    if (fontStyle.includes('strikethrough')) r.strikethrough = true;
    out[sel] = r;
  }
  out['*.deprecated'] = { strikethrough: true };
  return out;
}

// ------------------------------------------------------------------------------------------- workbench
function workbench(p) {
  const u = { ...p.ui };
  const light = p.type === 'light';
  const fg = u.editorFg;
  const bg = u.editorBg;
  // defaults for optional UI roles
  u.titleInactiveBg ??= u.titleBg;
  u.titleInactiveFg ??= mix(u.titleFg, u.titleBg, 0.35);
  u.chromeActiveFg ??= u.chromeFg;
  u.statusHoverBg ??= mix(u.statusBg, u.statusFg, 0.18);
  u.sideBorder ??= u.border;
  u.listInactiveSelBg ??= mix(u.listSelBg, u.sideBg, 0.35);
  u.listInactiveSelFg ??= u.listSelFg;
  u.buttonBorder ??= u.buttonBg;
  u.menuBg ??= u.widgetBg;
  u.menuFg ??= u.widgetFg;
  u.menuSelBg ??= u.listSelBg;
  u.menuSelFg ??= u.listSelFg;
  const sel = alpha(u.selection, u.selectionAlpha ?? 0.6);
  const subtle = mix(fg, bg, 0.5); // secondary text
  const scroll = alpha(mix(fg, bg, 0.4), 0.5);
  const hl = alpha(u.accent, 0.25); // matches / word highlights
  const ansi = p.ansi;

  return {
    // base
    foreground: u.sideFg,
    descriptionForeground: mix(u.sideFg, u.sideBg, 0.3),
    disabledForeground: mix(u.sideFg, u.sideBg, 0.5),
    errorForeground: u.error,
    focusBorder: u.focus,
    'icon.foreground': u.sideFg,
    'selection.background': sel,
    'widget.shadow': light ? '#00000040' : '#00000080',
    'widget.border': u.widgetBorder,
    'sash.hoverBorder': u.focus,
    'textLink.foreground': u.accent,
    'textLink.activeForeground': u.accent,
    'textPreformat.foreground': u.accent,
    'textBlockQuote.border': u.border,
    'textCodeBlock.background': u.lineHighlight,
    'progressBar.background': u.accent,
    'toolbar.hoverBackground': alpha(u.listHoverBg, 1),

    // title bar / command center / menu bar
    'titleBar.activeBackground': u.titleBg,
    'titleBar.activeForeground': u.titleFg,
    'titleBar.inactiveBackground': u.titleInactiveBg,
    'titleBar.inactiveForeground': u.titleInactiveFg,
    'titleBar.border': u.border,
    'commandCenter.background': mix(u.titleBg, u.titleFg, 0.08),
    'commandCenter.foreground': u.titleFg,
    'commandCenter.activeBackground': mix(u.titleBg, u.titleFg, 0.16),
    'commandCenter.border': alpha(u.titleFg, 0.4),
    'commandCenter.inactiveBorder': alpha(u.titleInactiveFg, 0.3),
    'menubar.selectionBackground': u.menuSelBg,
    'menubar.selectionForeground': u.menuSelFg,
    'menu.background': u.menuBg,
    'menu.foreground': u.menuFg,
    'menu.border': u.widgetBorder,
    'menu.selectionBackground': u.menuSelBg,
    'menu.selectionForeground': u.menuSelFg,
    'menu.separatorBackground': mix(u.menuFg, u.menuBg, 0.6),

    // activity bar
    'activityBar.background': u.chromeBg,
    'activityBar.foreground': u.chromeActiveFg,
    'activityBar.inactiveForeground': u.chromeInactiveFg,
    'activityBar.border': u.border,
    'activityBar.activeBorder': u.chromeActiveFg,
    'activityBar.activeFocusBorder': u.focus,
    'activityBarBadge.background': u.badgeBg,
    'activityBarBadge.foreground': u.badgeFg,
    'activityBarTop.foreground': u.sideHeaderFg,
    'activityBarTop.inactiveForeground': mix(u.sideHeaderFg, u.sideHeaderBg, 0.4),
    'activityBarTop.activeBorder': u.sideHeaderFg,

    // status bar
    'statusBar.background': u.statusBg,
    'statusBar.foreground': u.statusFg,
    'statusBar.border': u.border,
    'statusBar.focusBorder': u.focus,
    'statusBar.noFolderBackground': u.statusBg,
    'statusBar.noFolderForeground': u.statusFg,
    'statusBar.debuggingBackground': u.remoteBg,
    'statusBar.debuggingForeground': u.remoteFg,
    'statusBarItem.hoverBackground': u.statusHoverBg,
    'statusBarItem.hoverForeground': u.statusHoverBg === u.statusBg ? u.statusFg : undefined,
    'statusBarItem.activeBackground': mix(u.statusBg, u.statusFg, 0.3),
    'statusBarItem.remoteBackground': u.remoteBg,
    'statusBarItem.remoteForeground': u.remoteFg,
    'statusBarItem.remoteHoverBackground': mix(u.remoteBg, u.remoteFg, 0.15),
    'statusBarItem.errorBackground': light ? '#C00000' : '#AA0000',
    'statusBarItem.errorForeground': '#FFFFFF',
    'statusBarItem.warningBackground': light ? '#8A6D00' : '#AA5500',
    'statusBarItem.warningForeground': '#FFFFFF',
    'statusBarItem.prominentBackground': mix(u.statusBg, u.statusFg, 0.2),
    'statusBarItem.prominentHoverBackground': mix(u.statusBg, u.statusFg, 0.3),

    // VS Code's modern (floating) layout: the "shell" between the parts is the retro frame
    'modernUI.shellBackground': u.chromeBg,
    'modernUI.inactiveShellBackground': u.chromeBg,
    'surface.background': u.sideBg,
    'surface.foreground': u.sideFg,
    'surface.border': u.sideBorder,
    'editor.border': u.border,
    'editorPane.background': bg,
    'modernActivityBar.background': u.chromeBg,
    'modernActivityBar.inactiveBackground': u.chromeBg,
    'modernActivityBar.border': u.border,
    'modernActivityBarItem.activeBackground': mix(u.chromeBg, u.chromeActiveFg, 0.2),
    'modernActivityBarItem.activeForeground': u.chromeActiveFg,
    'modernActivityBarItem.hoverBackground': mix(u.chromeBg, u.chromeActiveFg, 0.12),
    'modernActivityBarItem.hoverForeground': u.chromeActiveFg,
    'modernEditorTab.activeBackground': u.tabActiveBg,
    'modernEditorTab.activeForeground': u.tabActiveFg,
    'modernEditorTab.inactiveBackground': u.tabBg,
    'modernEditorTab.hoverBackground': mix(u.tabBg, u.tabActiveBg, 0.5),
    'modernEditorTab.hoverForeground': u.tabActiveFg,

    // side bar / panel
    'sideBar.background': u.sideBg,
    'sideBar.foreground': u.sideFg,
    'sideBar.border': u.sideBorder,
    'sideBarTitle.foreground': u.sideHeaderFg,
    'sideBarTitle.background': u.sideHeaderBg,
    'sideBarSectionHeader.background': u.sideHeaderBg,
    'sideBarSectionHeader.foreground': u.sideHeaderFg,
    'sideBarSectionHeader.border': u.sideBorder,
    'sideBarStickyScroll.background': u.sideBg,
    'auxiliaryBar.background': u.sideBg,
    'panel.background': u.panelBg,
    'panel.border': u.border,
    'panelTitle.activeForeground': u.panelFg,
    'panelTitle.inactiveForeground': mix(u.panelFg, u.panelBg, 0.4),
    'panelTitle.activeBorder': u.panelFg,
    'panelSection.border': u.border,
    'panelSectionHeader.background': u.sideHeaderBg,
    'panelInput.border': u.inputBorder,
    'outputView.background': u.panelBg,

    // editor groups / tabs / breadcrumbs
    'editorGroup.border': u.border,
    'editorGroup.emptyBackground': bg,
    'editorGroupHeader.tabsBackground': u.tabBarBg,
    'editorGroupHeader.tabsBorder': u.border,
    'editorGroupHeader.noTabsBackground': bg,
    'tab.activeBackground': u.tabActiveBg,
    'tab.activeForeground': u.tabActiveFg,
    'tab.activeBorderTop': u.tabActiveTop,
    'tab.selectedBackground': u.tabActiveBg,
    'tab.selectedForeground': u.tabActiveFg,
    'tab.unfocusedActiveBackground': u.tabActiveBg,
    'tab.unfocusedActiveForeground': mix(u.tabActiveFg, u.tabActiveBg, 0.25),
    'tab.unfocusedActiveBorderTop': mix(u.tabActiveTop, u.tabActiveBg, 0.4),
    'tab.inactiveBackground': u.tabBg,
    'tab.inactiveForeground': u.tabFg,
    'tab.unfocusedInactiveBackground': u.tabBg,
    'tab.unfocusedInactiveForeground': u.tabFg,
    'tab.hoverBackground': mix(u.tabBg, u.tabActiveBg, 0.5),
    'tab.unfocusedHoverBackground': mix(u.tabBg, u.tabActiveBg, 0.5),
    'tab.border': u.border,
    'tab.lastPinnedBorder': u.border,
    'tab.dragAndDropBorder': u.focus,
    'breadcrumb.background': bg,
    'breadcrumb.foreground': subtle,
    'breadcrumb.focusForeground': fg,
    'breadcrumb.activeSelectionForeground': fg,
    'breadcrumbPicker.background': u.widgetBg,

    // editor
    'editor.background': bg,
    'editor.foreground': fg,
    'editorCursor.foreground': u.cursor,
    'editorCursor.background': bg,
    'editor.lineHighlightBackground': u.lineHighlight,
    'editor.lineHighlightBorder': u.lineHighlight,
    'editorLineNumber.foreground': u.lineNumber,
    'editorLineNumber.activeForeground': u.lineNumberActive,
    'editor.selectionBackground': sel,
    'editor.inactiveSelectionBackground': alpha(u.selection, (u.selectionAlpha ?? 0.6) * 0.55),
    'editor.selectionHighlightBackground': hl,
    'editor.wordHighlightBackground': hl,
    'editor.wordHighlightStrongBackground': alpha(u.accent, 0.35),
    'editor.findMatchBackground': alpha(u.accent, 0.5),
    'editor.findMatchBorder': u.accent,
    'editor.findMatchHighlightBackground': hl,
    'editor.findRangeHighlightBackground': alpha(u.selection, 0.15),
    'editor.rangeHighlightBackground': alpha(u.selection, 0.15),
    'editor.hoverHighlightBackground': alpha(u.selection, 0.2),
    'editor.foldBackground': alpha(u.selection, 0.12),
    'editorBracketMatch.background': alpha(u.accent, 0.2),
    'editorBracketMatch.border': u.accent,
    'editorIndentGuide.background1': alpha(fg, 0.15),
    'editorIndentGuide.activeBackground1': alpha(fg, 0.4),
    'editorRuler.foreground': alpha(fg, 0.2),
    'editorWhitespace.foreground': alpha(fg, 0.25),
    'editorCodeLens.foreground': subtle,
    'editorInlayHint.foreground': subtle,
    'editorInlayHint.background': '#00000000',
    'editorLink.activeForeground': u.accent,
    'editorError.foreground': u.error,
    'editorWarning.foreground': u.warning,
    'editorInfo.foreground': u.info,
    'editorHint.foreground': u.info,
    'problemsErrorIcon.foreground': u.error,
    'problemsWarningIcon.foreground': u.warning,
    'problemsInfoIcon.foreground': u.info,
    'editorGutter.background': bg,
    'editorGutter.addedBackground': u.added,
    'editorGutter.modifiedBackground': u.modified,
    'editorGutter.deletedBackground': u.deleted,
    'editorOverviewRuler.border': '#00000000',
    'editorOverviewRuler.addedForeground': alpha(u.added, 0.7),
    'editorOverviewRuler.modifiedForeground': alpha(u.modified, 0.7),
    'editorOverviewRuler.deletedForeground': alpha(u.deleted, 0.7),
    'editorOverviewRuler.errorForeground': u.error,
    'editorOverviewRuler.warningForeground': u.warning,
    'editorOverviewRuler.findMatchForeground': u.accent,
    'editorStickyScroll.background': bg,
    'editorStickyScroll.border': u.border,
    'editorStickyScrollHover.background': u.lineHighlight,
    // retro screens had one text color – no rainbow brackets
    'editorBracketHighlight.foreground1': fg,
    'editorBracketHighlight.foreground2': fg,
    'editorBracketHighlight.foreground3': fg,
    'editorBracketHighlight.foreground4': fg,
    'editorBracketHighlight.foreground5': fg,
    'editorBracketHighlight.foreground6': fg,
    'editorBracketHighlight.unexpectedBracket.foreground': u.error,
    'minimap.background': bg,
    'minimapSlider.background': scroll,
    'minimapSlider.hoverBackground': alpha(mix(fg, bg, 0.3), 0.6),
    'minimapSlider.activeBackground': alpha(mix(fg, bg, 0.2), 0.7),
    'minimapGutter.addedBackground': u.added,
    'minimapGutter.modifiedBackground': u.modified,
    'minimapGutter.deletedBackground': u.deleted,

    // widgets
    'editorWidget.background': u.widgetBg,
    'editorWidget.foreground': u.widgetFg,
    'editorWidget.border': u.widgetBorder,
    'editorSuggestWidget.background': u.widgetBg,
    'editorSuggestWidget.border': u.widgetBorder,
    'editorSuggestWidget.foreground': u.widgetFg,
    'editorSuggestWidget.selectedBackground': u.listSelBg,
    'editorSuggestWidget.selectedForeground': u.listSelFg,
    'editorSuggestWidget.highlightForeground': u.widgetFg,
    'editorSuggestWidget.focusHighlightForeground': u.listSelFg,
    'editorHoverWidget.background': u.widgetBg,
    'editorHoverWidget.foreground': u.widgetFg,
    'editorHoverWidget.border': u.widgetBorder,
    'editorHoverWidget.statusBarBackground': mix(u.widgetBg, u.widgetFg, 0.08),
    'debugExceptionWidget.background': u.widgetBg,
    'debugExceptionWidget.border': u.error,
    'peekView.border': u.focus,
    'peekViewTitle.background': u.sideHeaderBg,
    'peekViewTitleLabel.foreground': u.sideHeaderFg,
    'peekViewTitleDescription.foreground': mix(u.sideHeaderFg, u.sideHeaderBg, 0.3),
    'peekViewEditor.background': bg,
    'peekViewEditorGutter.background': bg,
    'peekViewEditor.matchHighlightBackground': hl,
    'peekViewResult.background': u.sideBg,
    'peekViewResult.fileForeground': u.sideFg,
    'peekViewResult.lineForeground': mix(u.sideFg, u.sideBg, 0.2),
    'peekViewResult.matchHighlightBackground': hl,
    'peekViewResult.selectionBackground': u.listSelBg,
    'peekViewResult.selectionForeground': u.listSelFg,
    'quickInput.background': u.widgetBg,
    'quickInput.foreground': u.widgetFg,
    'quickInputTitle.background': mix(u.widgetBg, u.widgetFg, 0.08),
    'quickInputList.focusBackground': u.listSelBg,
    'quickInputList.focusForeground': u.listSelFg,
    'quickInputList.focusIconForeground': u.listSelFg,
    'pickerGroup.border': mix(u.widgetFg, u.widgetBg, 0.6),
    'pickerGroup.foreground': u.widgetFg,
    'notifications.background': u.widgetBg,
    'notifications.foreground': u.widgetFg,
    'notifications.border': u.widgetBorder,
    'notificationCenterHeader.background': mix(u.widgetBg, u.widgetFg, 0.08),
    'notificationCenterHeader.foreground': u.widgetFg,
    'notificationToast.border': u.widgetBorder,
    'notificationLink.foreground': u.widgetFg,
    'notificationsErrorIcon.foreground': light ? u.error : u.widgetFg === '#000000' ? '#AA0000' : u.error,
    'notificationsWarningIcon.foreground': light ? u.warning : u.widgetFg === '#000000' ? '#AA5500' : u.warning,
    'notificationsInfoIcon.foreground': light ? u.info : u.widgetFg === '#000000' ? '#0000AA' : u.info,
    'hover.background': u.widgetBg,

    // lists / trees
    'list.activeSelectionBackground': u.listSelBg,
    'list.activeSelectionForeground': u.listSelFg,
    'list.activeSelectionIconForeground': u.listSelFg,
    'list.inactiveSelectionBackground': u.listInactiveSelBg,
    'list.inactiveSelectionForeground': u.listInactiveSelFg,
    'list.focusBackground': u.listSelBg,
    'list.focusForeground': u.listSelFg,
    'list.focusOutline': u.focus,
    'list.focusAndSelectionOutline': u.focus,
    'list.inactiveFocusOutline': '#00000000',
    'list.hoverBackground': u.listHoverBg,
    'list.hoverForeground': u.sideFg,
    'list.highlightForeground': u.sideFg,
    'list.focusHighlightForeground': u.listSelFg,
    'list.dropBackground': alpha(u.listSelBg, 0.5),
    'list.errorForeground': u.sideBg === bg ? u.error : undefined,
    'list.warningForeground': u.sideBg === bg ? u.warning : undefined,
    'tree.indentGuidesStroke': alpha(u.sideFg, 0.3),
    'listFilterWidget.background': u.widgetBg,
    'listFilterWidget.outline': u.focus,

    // controls
    'button.background': u.buttonBg,
    'button.foreground': u.buttonFg,
    'button.hoverBackground': mix(u.buttonBg, u.buttonFg, 0.12),
    'button.border': u.buttonBorder,
    'button.secondaryBackground': u.inputBg,
    'button.secondaryForeground': u.inputFg,
    'button.secondaryHoverBackground': mix(u.inputBg, u.inputFg, 0.12),
    'checkbox.background': u.inputBg,
    'checkbox.border': u.inputBorder,
    'checkbox.foreground': u.inputFg,
    'dropdown.background': u.inputBg,
    'dropdown.listBackground': u.widgetBg,
    'dropdown.border': u.inputBorder,
    'dropdown.foreground': u.inputFg,
    'input.background': u.inputBg,
    'input.border': u.inputBorder,
    'input.foreground': u.inputFg,
    'input.placeholderForeground': mix(u.inputFg, u.inputBg, 0.45),
    'inputOption.activeBackground': alpha(u.focus, 0.3),
    'inputOption.activeBorder': u.focus,
    'inputOption.activeForeground': u.inputFg,
    'inputValidation.errorBackground': u.inputBg,
    'inputValidation.errorBorder': u.error,
    'inputValidation.warningBackground': u.inputBg,
    'inputValidation.warningBorder': u.warning,
    'inputValidation.infoBackground': u.inputBg,
    'inputValidation.infoBorder': u.info,
    'badge.background': u.badgeBg,
    'badge.foreground': u.badgeFg,
    'keybindingLabel.background': mix(u.widgetBg, u.widgetFg, 0.08),
    'keybindingLabel.foreground': u.widgetFg,
    'keybindingLabel.border': mix(u.widgetFg, u.widgetBg, 0.5),
    'keybindingLabel.bottomBorder': mix(u.widgetFg, u.widgetBg, 0.5),
    'scrollbar.shadow': '#00000000',
    'scrollbarSlider.background': scroll,
    'scrollbarSlider.hoverBackground': alpha(mix(fg, bg, 0.3), 0.6),
    'scrollbarSlider.activeBackground': alpha(mix(fg, bg, 0.2), 0.7),
    'settings.headerForeground': fg,
    'settings.modifiedItemIndicator': u.accent,
    'settings.focusedRowBackground': u.lineHighlight,
    'settings.rowHoverBackground': u.lineHighlight,
    'welcomePage.tileBackground': u.sideBg,
    'welcomePage.tileHoverBackground': u.listHoverBg,

    // git / diff / merge
    'gitDecoration.modifiedResourceForeground': u.sideBg === bg ? u.modified : undefined,
    'gitDecoration.addedResourceForeground': u.sideBg === bg ? u.added : undefined,
    'gitDecoration.untrackedResourceForeground': u.sideBg === bg ? u.added : undefined,
    'gitDecoration.deletedResourceForeground': u.sideBg === bg ? u.deleted : undefined,
    'gitDecoration.ignoredResourceForeground': mix(u.sideFg, u.sideBg, 0.45),
    'diffEditor.insertedTextBackground': alpha(u.added, 0.25),
    'diffEditor.insertedLineBackground': alpha(u.added, 0.12),
    'diffEditor.removedTextBackground': alpha(u.deleted, 0.25),
    'diffEditor.removedLineBackground': alpha(u.deleted, 0.12),
    'merge.currentHeaderBackground': alpha(u.added, 0.4),
    'merge.currentContentBackground': alpha(u.added, 0.15),
    'merge.incomingHeaderBackground': alpha(u.info, 0.4),
    'merge.incomingContentBackground': alpha(u.info, 0.15),

    // debug / testing
    'editor.stackFrameHighlightBackground': alpha(u.warning, 0.2),
    'editor.focusedStackFrameHighlightBackground': alpha(u.added, 0.2),
    'debugIcon.breakpointForeground': u.error,
    'debugToolBar.background': u.widgetBg,
    'testing.iconPassed': u.added,
    'testing.iconFailed': u.error,

    // terminal
    'terminal.background': u.panelBg === bg ? bg : u.panelBg,
    'terminal.foreground': u.panelBg === bg ? fg : u.panelFg,
    'terminal.selectionBackground': sel,
    'terminalCursor.foreground': u.cursor,
    'terminal.border': u.border,
    ...Object.fromEntries(
      ['Black', 'Red', 'Green', 'Yellow', 'Blue', 'Magenta', 'Cyan', 'White'].flatMap((n, i) => [
        [`terminal.ansi${n}`, ansi[i]],
        [`terminal.ansiBright${n}`, ansi[i + 8]],
      ]),
    ),
  };
}

function build(p) {
  const colors = workbench(p);
  for (const [k, v] of Object.entries(colors)) {
    if (v === undefined) delete colors[k];
    else colors[k] = hex(v);
  }
  return {
    $schema: 'vscode://schemas/color-theme',
    name: p.label,
    type: p.type,
    semanticHighlighting: true,
    colors,
    tokenColors: tokenColors(p),
    semanticTokenColors: semanticTokenColors(p),
  };
}

const themeFile = p => path.join(OUT, `${p.id}-color-theme.json`);

if (require.main === module) {
  fs.mkdirSync(OUT, { recursive: true });
  for (const p of PALETTES) {
    const theme = build(p);
    fs.writeFileSync(themeFile(p), JSON.stringify(theme, null, 2) + '\n');
    console.log(`wrote themes/${p.id}-color-theme.json: ${Object.keys(theme.colors).length} colors, ${theme.tokenColors.length} token rules`);
  }
}

module.exports = { build, themeFile, PALETTES, mix, rgb };
