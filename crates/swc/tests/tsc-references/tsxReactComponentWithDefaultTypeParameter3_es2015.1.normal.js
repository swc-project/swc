// @filename: file.tsx
// @jsx: preserve
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
const React = require('react');
// Error
let x1 = /*#__PURE__*/ React.createElement(MyComp, null);
// OK
let x = /*#__PURE__*/ React.createElement(MyComp, {
    a: 10,
    b: "hi"
});
// Error
let x2 = /*#__PURE__*/ React.createElement(MyComp, {
    a: "hi"
});
