import * as swcHelpers from "@swc/helpers";
// @filename: file.tsx
// @jsx: preserve
// @module: amd
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
const React = require('react');
function createComponent(arg) {
    let a1 = /*#__PURE__*/ React.createElement(Component, swcHelpers.extends({}, arg));
    let a2 = /*#__PURE__*/ React.createElement(Component, swcHelpers.extends({}, arg, {
        prop1: true
    }));
}
function Bar(arg) {
    let a1 = /*#__PURE__*/ React.createElement(ComponentSpecific, swcHelpers.extends({}, arg, {
        "ignore-prop": "hi"
    })); // U is number
    let a2 = /*#__PURE__*/ React.createElement(ComponentSpecific1, swcHelpers.extends({}, arg, {
        "ignore-prop": 10
    })); // U is number
    let a3 = /*#__PURE__*/ React.createElement(ComponentSpecific, swcHelpers.extends({}, arg, {
        prop: "hello"
    })); // U is "hello"
    let a4 = /*#__PURE__*/ React.createElement(ComponentSpecific, swcHelpers.extends({}, arg, {
        prop1: "hello"
    })); // U is "hello"
}
export { };
