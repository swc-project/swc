//// [file.tsx]
/*#__PURE__*/ React.createElement("div", null, "Dot goes here: &middot; &notAnEntity; ");
/*#__PURE__*/ React.createElement("div", null, "Be careful of &quot;-ed strings!");
/*#__PURE__*/ React.createElement("div", null, "&#0123;&#123;braces&#x7d;&#x7D;");
// Escapes do nothing
/*#__PURE__*/ React.createElement("div", null, "\\n");
// Also works in string literal attributes
/*#__PURE__*/ React.createElement("div", {
    attr: "{…}\\"
});
// Does not happen for a string literal that happens to be inside an attribute (and escapes then work)
/*#__PURE__*/ React.createElement("div", {
    attr: "&#0123;&hellip;&#x7D;\""
});
// Preserves single quotes
/*#__PURE__*/ React.createElement("div", {
    attr: '"'
});
// https://github.com/microsoft/TypeScript/issues/35732
/*#__PURE__*/ React.createElement("div", null, "&#x1F408;&#x1F415;&#128007;&#128017;");
