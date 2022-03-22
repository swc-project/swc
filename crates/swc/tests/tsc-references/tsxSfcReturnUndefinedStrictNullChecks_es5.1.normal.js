// @filename: file.tsx
// @jsx: preserve
// @module: amd
// @noLib: true
// @strictNullChecks: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
var React = require("react");
var Foo = function(props) {
    return undefined;
};
function Greet(x) {
    return undefined;
}
// Error
var foo = /*#__PURE__*/ React.createElement(Foo, null);
var G = /*#__PURE__*/ React.createElement(Greet, null);
export { };
