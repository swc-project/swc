// @filename: file.tsx
// @jsx: preserve
// @module: amd
// @noLib: true
// @strictNullChecks: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
const React = require('react');
const Foo = (props)=>undefined;
function Greet(x) {
    return undefined;
}
// Error
const foo = /*#__PURE__*/ React.createElement(Foo, null);
const G = /*#__PURE__*/ React.createElement(Greet, null);
export { };
