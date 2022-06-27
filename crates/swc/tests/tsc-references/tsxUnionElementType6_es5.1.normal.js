// @filename: file.tsx
// @jsx: react
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
var React = require("react");
function EmptySFC1() {
    return /*#__PURE__*/ React.createElement("div", null, "Hi");
}
function EmptySFC2() {
    return /*#__PURE__*/ React.createElement("div", null, "Hello");
}
function SFC2(prop) {
    return /*#__PURE__*/ React.createElement("h1", null, "World");
}
var EmptySFCComp = EmptySFC1 || EmptySFC2;
var SFC2AndEmptyComp = SFC2 || EmptySFC1;
// Error
var a = /*#__PURE__*/ React.createElement(EmptySFCComp, {
    x: true
});
var b = /*#__PURE__*/ React.createElement(SFC2AndEmptyComp, {
    x: "hi"
});
var c = /*#__PURE__*/ React.createElement(SFC2AndEmptyComp, null);
var d = /*#__PURE__*/ React.createElement(SFC2AndEmptyComp, {
    "data-prop": true
});
export { };
