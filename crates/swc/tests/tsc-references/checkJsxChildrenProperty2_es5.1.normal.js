import _extends from "@swc/helpers/src/_extends.mjs";
// @filename: file.tsx
// @jsx: preserve
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
// @strictNullChecks: true
var React = require("react");
function Comp(p) {
    return /*#__PURE__*/ React.createElement("div", null, p.b);
}
// Error: missing children
var k = /*#__PURE__*/ React.createElement(Comp, {
    a: 10,
    b: "hi"
});
var k0 = /*#__PURE__*/ React.createElement(Comp, {
    a: 10,
    b: "hi",
    children: "Random"
}, "hi hi hi!");
var o = {
    children: "Random"
};
var k1 = /*#__PURE__*/ React.createElement(Comp, _extends({
    a: 10,
    b: "hi"
}, o), "hi hi hi!");
// Error: incorrect type
var k2 = /*#__PURE__*/ React.createElement(Comp, {
    a: 10,
    b: "hi"
}, /*#__PURE__*/ React.createElement("div", null, " My Div "), function(name) {
    return /*#__PURE__*/ React.createElement("div", null, " My name ", name, " ");
});
var k3 = /*#__PURE__*/ React.createElement(Comp, {
    a: 10,
    b: "hi"
}, /*#__PURE__*/ React.createElement("div", null, " My Div "), 1000000);
var k4 = /*#__PURE__*/ React.createElement(Comp, {
    a: 10,
    b: "hi"
}, /*#__PURE__*/ React.createElement("div", null, " My Div "), "hi hi hi!");
var k5 = /*#__PURE__*/ React.createElement(Comp, {
    a: 10,
    b: "hi"
}, /*#__PURE__*/ React.createElement("div", null, " My Div "), /*#__PURE__*/ React.createElement("div", null, " My Div "));
export { };
