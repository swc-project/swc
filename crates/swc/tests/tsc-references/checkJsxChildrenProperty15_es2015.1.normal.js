// @filename: file.tsx
// @jsx: preserve
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
const React = require('react');
const Tag = (x)=>/*#__PURE__*/ React.createElement("div", null);
// OK
const k1 = /*#__PURE__*/ React.createElement(Tag, null);
const k2 = /*#__PURE__*/ React.createElement(Tag, null);
// Not OK (excess children)
const k3 = /*#__PURE__*/ React.createElement(Tag, {
    children: /*#__PURE__*/ React.createElement("div", null)
});
const k4 = /*#__PURE__*/ React.createElement(Tag, {
    key: "1"
}, /*#__PURE__*/ React.createElement("div", null));
const k5 = /*#__PURE__*/ React.createElement(Tag, {
    key: "1"
}, /*#__PURE__*/ React.createElement("div", null), /*#__PURE__*/ React.createElement("div", null));
export { };
