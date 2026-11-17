// Maps the IntelliJ text attribute keys used in scopes.js to the handful of syntax roles a retro palette defines.
// First matching rule wins.
const RULES = [
  [/DEPRECATED/, 'deprecated'],
  [/WRONG_REFERENCES|BAD_CHARACTER/, 'invalid'],
  [/DOC_COMMENT_TAG|DOC_MARKUP/, 'docTag'],
  [/DOC_COMMENT|org\.rust\.DOC/, 'docComment'],
  [/COMMENT/, 'comment'],
  [/ESCAPE|FSTRING_FRAGMENT|TEMPLATE_LITERAL_PLACEHOLDER|FORMAT_PARAMETER|ENTITY_REFERENCE|Q_OPERATOR/, 'escape'],
  [/REGEXP/, 'regexp'],
  [/^MARKDOWN_HEADER/, 'heading'],
  [/^MARKDOWN_BOLD$/, 'bold'],
  [/^MARKDOWN_STRIKE_THROUGH$/, 'deprecated'],
  [/^MARKDOWN_ITALIC$/, 'italic'],
  [/^MARKDOWN_(CODE_SPAN|LINK_DESTINATION)$/, 'string'],
  [/^MARKDOWN_LINK_TEXT$/, 'link'],
  [/^MARKDOWN_/, 'keyword'],
  [/CSS\.PROPERTY_VALUE|CSS\.URL/, 'string'],
  [/STRING|ATTRIBUTE_VALUE|PROPERTIES\.VALUE/, 'string'],
  [/NUMBER|CSS\.COLOR/, 'number'],
  [/METADATA|ANNOTATION|DECORATOR|org\.rust\.ATTRIBUTE|PREPROCESSOR|CSS\.IMPORTANT|MACRO|PHP\.TAG/, 'annotation'],
  [/SELF_PARAMETER|KEYWORD_ARGUMENT/, 'self'],
  [/^GO_FUNCTION_PARAMETER$/, 'text'],
  [/LOCAL_CONSTANT/, 'constant'],
  [/KEYWORD|PRIMITIVE|BUILTIN_TYPE|BUILTIN_CONSTANT|LABEL/, 'keyword'],
  [/BUILTIN_NAME|PREDEFINED|BUILTIN_FUNCTION|GLOBAL_VARIABLE|PACKAGE_PROPERTY/, 'builtin'],
  [/FUNCTION_DECLARATION|METHOD_DECLARATION|FUNC_DEFINITION|^org\.rust\.(FUNCTION|METHOD|ASSOC_FUNCTION)$|^GO_LOCAL_FUNCTION$|LOCAL_FUNCTION$/, 'function'],
  [/FUNCTION|METHOD|CSS\.FUNCTION/, 'call'],
  [/TYPE_PARAMETER|LIFETIME/, 'typeParameter'],
  [/CLASS|INTERFACE|ENUM_NAME|RECORD|TYPE_|MODULE|PACKAGE|CSS\.IDENT|CSS\.TAG_NAME|JSX|STRUCT$|org\.rust\.(ENUM|TRAIT)$|TYPE_ALIAS/, 'type'],
  [/STATIC_FINAL|CONSTANT|STATIC_FIELD|STATIC_MEMBER|ENUM_VARIANT|org\.rust\.STATIC/, 'constant'],
  [/FIELD|MEMBER_VARIABLE|PROPERTY_NAME|PROPERTY_KEY|SCALAR_KEY|PROPERTIES\.KEY|PHP\.VARIABLE/, 'field'],
  [/TAG_NAME|XML_PROLOGUE/, 'tag'],
  [/ATTRIBUTE_NAME/, 'attribute'],
  [/OPERATION_SIGN/, 'operator'],
];

function roleOf(key) {
  for (const [re, role] of RULES) if (re.test(key)) return role;
  return 'text';
}

/** Roles a palette may leave out, with the role they fall back to. */
const FALLBACK = {
  docComment: 'comment',
  docTag: 'docComment',
  escape: 'keyword',
  regexp: 'string',
  heading: 'keyword',
  bold: 'text',
  italic: 'text',
  link: 'string',
  annotation: 'keyword',
  self: 'keyword',
  builtin: 'text',
  function: 'text',
  call: 'text',
  typeParameter: 'type',
  type: 'text',
  constant: 'number',
  field: 'text',
  tag: 'keyword',
  attribute: 'field',
  operator: 'text',
  invalid: 'text',
  deprecated: 'text',
};

/** Font styles that belong to a role, independent of the palette. */
const STYLE = { heading: 'bold', bold: 'bold', italic: 'italic', invalid: 'underline', deprecated: 'strikethrough', link: 'underline' };

/** { foreground, fontStyle } of a role in a palette (`syntax` = { role: '#RRGGBB' | ['#RRGGBB', 'bold italic'] }). */
function resolve(syntax, role) {
  let r = role;
  const seen = new Set();
  while (syntax[r] === undefined && FALLBACK[r] && !seen.has(r)) {
    seen.add(r);
    r = FALLBACK[r];
  }
  const v = syntax[r] ?? syntax.text;
  const [foreground, own = ''] = Array.isArray(v) ? v : [v];
  // the role's inherent style + the palette's style of the role it resolved to
  const styles = new Set([...own.split(' '), ...(STYLE[role] ?? '').split(' ')].filter(Boolean));
  return { foreground, fontStyle: [...styles].join(' ') };
}

module.exports = { roleOf, resolve, FALLBACK };
