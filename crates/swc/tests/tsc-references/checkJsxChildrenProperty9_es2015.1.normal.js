// @filename: file.tsx
// @jsx: preserve
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
const React = require('react');
// OK
let k1 = /*#__PURE__*/ React.createElement("div", null, " ", /*#__PURE__*/ React.createElement("h2", null, " Hello "), " ", /*#__PURE__*/ React.createElement("h1", null, " world "));
let k2 = /*#__PURE__*/ React.createElement("div", null, " ", /*#__PURE__*/ React.createElement("h2", null, " Hello "), " ", (user)=>/*#__PURE__*/ React.createElement("h2", null, user.name));
let k3 = /*#__PURE__*/ React.createElement("div", null, " ", 1, " ", "That is a number", " ");
export { };
