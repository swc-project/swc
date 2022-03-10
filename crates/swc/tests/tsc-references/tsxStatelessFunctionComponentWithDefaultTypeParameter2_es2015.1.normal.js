// @filename: file.tsx
// @jsx: preserve
// @module: amd
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
const React = require('react');
function MyComponent1(attr) {
    return /*#__PURE__*/ React.createElement("div", null, "attr.values");
}
// Error
let i1 = /*#__PURE__*/ React.createElement(MyComponent1, {
    values: 5
});
export { };
