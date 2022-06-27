// @filename: file.tsx
// @jsx: react
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
var React = require("react");
function SFC1(prop) {
    return /*#__PURE__*/ React.createElement("div", null, "hello");
}
function SFC2(prop) {
    return /*#__PURE__*/ React.createElement("h1", null, "World ");
}
var SFCComp = SFC1 || SFC2;
/*#__PURE__*/ React.createElement(SFCComp, {
    x: true
});
