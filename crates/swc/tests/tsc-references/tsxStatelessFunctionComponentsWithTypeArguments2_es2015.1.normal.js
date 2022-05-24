import _extends from "@swc/helpers/lib/_extends.js";
// @filename: file.tsx
// @jsx: preserve
// @module: amd
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
const React = require('react');
// Error
function Bar(arg) {
    let a1 = /*#__PURE__*/ React.createElement(ComponentSpecific1, _extends({}, arg, {
        "ignore-prop": 10
    }));
}
// Error
function Baz(arg) {
    let a0 = /*#__PURE__*/ React.createElement(ComponentSpecific1, _extends({}, arg));
}
// Error
function createLink(func) {
    let o = /*#__PURE__*/ React.createElement(Link, {
        func: func
    });
}
// Error
let i = /*#__PURE__*/ React.createElement(InferParamComponent, {
    values: [
        1,
        2,
        3,
        4
    ],
    selectHandler: (val)=>{}
});
export { };
