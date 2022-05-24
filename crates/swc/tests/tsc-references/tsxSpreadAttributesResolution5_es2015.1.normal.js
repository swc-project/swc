import _extends from "@swc/helpers/lib/_extends.js";
// @filename: file.tsx
// @jsx: preserve
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
const React = require('react');
class Poisoned extends React.Component {
    render() {
        return /*#__PURE__*/ React.createElement("div", null, "Hello");
    }
}
let obj = {
    x: "hello world",
    y: 2
};
// Error as "obj" has type { x: string; y: number }
let p = /*#__PURE__*/ React.createElement(Poisoned, _extends({}, obj));
class EmptyProp extends React.Component {
    render() {
        return /*#__PURE__*/ React.createElement("div", null, "Default hi");
    }
}
let o = {
    prop1: false
};
// Ok
let e = /*#__PURE__*/ React.createElement(EmptyProp, _extends({}, o));
export { };
