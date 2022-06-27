// @filename: file.tsx
// @jsx: preserve
// @module: amd
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
const React = require('react');
function MyComponent(attr) {
    return /*#__PURE__*/ React.createElement("div", null, "attr.values");
}
// OK
let i = /*#__PURE__*/ React.createElement(MyComponent, {
    values: true
}); // We infer type arguments here
let i1 = /*#__PURE__*/ React.createElement(MyComponent, {
    values: "Hello"
});
export { };
