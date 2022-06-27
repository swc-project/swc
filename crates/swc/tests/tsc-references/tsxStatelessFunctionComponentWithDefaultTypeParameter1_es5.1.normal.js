// @filename: file.tsx
// @jsx: preserve
// @module: amd
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
var React = require("react");
function MyComponent(attr) {
    return /*#__PURE__*/ React.createElement("div", null, "attr.values");
}
// OK
var i = /*#__PURE__*/ React.createElement(MyComponent, {
    values: true
}); // We infer type arguments here
var i1 = /*#__PURE__*/ React.createElement(MyComponent, {
    values: "Hello"
});
