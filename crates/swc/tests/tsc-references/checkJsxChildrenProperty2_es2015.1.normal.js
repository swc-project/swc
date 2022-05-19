import * as swcHelpers from "@swc/helpers";
// @filename: file.tsx
// @jsx: preserve
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
// @strictNullChecks: true
const React = require('react');
function Comp(p) {
    return /*#__PURE__*/ React.createElement("div", null, p.b);
}
// Error: missing children
let k = /*#__PURE__*/ React.createElement(Comp, {
    a: 10,
    b: "hi"
});
let k0 = /*#__PURE__*/ React.createElement(Comp, {
    a: 10,
    b: "hi",
    children: "Random"
}, "hi hi hi!");
let o = {
    children: "Random"
};
let k1 = /*#__PURE__*/ React.createElement(Comp, swcHelpers.extends({
    a: 10,
    b: "hi"
}, o), "hi hi hi!");
// Error: incorrect type
let k2 = /*#__PURE__*/ React.createElement(Comp, {
    a: 10,
    b: "hi"
}, /*#__PURE__*/ React.createElement("div", null, " My Div "), (name)=>/*#__PURE__*/ React.createElement("div", null, " My name ", name, " "));
let k3 = /*#__PURE__*/ React.createElement(Comp, {
    a: 10,
    b: "hi"
}, /*#__PURE__*/ React.createElement("div", null, " My Div "), 1000000);
let k4 = /*#__PURE__*/ React.createElement(Comp, {
    a: 10,
    b: "hi"
}, /*#__PURE__*/ React.createElement("div", null, " My Div "), "hi hi hi!");
let k5 = /*#__PURE__*/ React.createElement(Comp, {
    a: 10,
    b: "hi"
}, /*#__PURE__*/ React.createElement("div", null, " My Div "), /*#__PURE__*/ React.createElement("div", null, " My Div "));
export { };
