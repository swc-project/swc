// @filename: file.tsx
// @jsx: preserve
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
var React = require("react");
/*#__PURE__*/ React.createElement("div", null, "// Not Comment");
/*#__PURE__*/ React.createElement("div", null, "// Not Comment", "// Another not Comment");
/*#__PURE__*/ React.createElement("div", null, "// Not Comment", //Comment just Fine
"Hi", "// Another not Comment");
/*#__PURE__*/ React.createElement("div", null, "/* Not Comment */", //Comment just Fine
"Hi");
