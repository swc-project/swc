// @filename: file.tsx
// @jsx: preserve
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
const React = require('react');
function Comp(p) {
    return /*#__PURE__*/ React.createElement("div", null, p.b);
}
// OK
let k = /*#__PURE__*/ React.createElement(Comp, {
    a: 10,
    b: "hi",
    children: "lol"
});
let k1 = /*#__PURE__*/ React.createElement(Comp, {
    a: 10,
    b: "hi"
}, "hi hi hi!");
let k2 = /*#__PURE__*/ React.createElement(Comp, {
    a: 10,
    b: "hi"
}, /*#__PURE__*/ React.createElement("div", null, "hi hi hi!"));
export { };
