/*#__PURE__*/
function pure_html(strings, ...values) {
    return { strings, values };
}

// ✅ This is tree-shaken from the minified output.
const a = `<span>aaaa</span>`;

// ❌ This is not tree-shaken from the minified output,
// despite the "html" function being declare using
// `jsc.minify.compress.pure_funcs` configuration.
const b = pure_html`<span>bbbb</span>`;

// ✅ This is not tree-shaken from the minified output.
export const c = pure_html`<span>cccc</span>`;