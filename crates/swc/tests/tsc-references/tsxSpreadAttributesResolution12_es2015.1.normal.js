import _extends from "@swc/helpers/lib/_extends.js";
// @filename: file.tsx
// @jsx: preserve
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
const React = require('react');
const obj = {};
const obj1 = {
    x: 2
};
const obj3 = {
    y: false,
    overwrite: "hi"
};
class OverWriteAttr extends React.Component {
    render() {
        return /*#__PURE__*/ React.createElement("div", null, "Hello");
    }
}
let anyobj;
// Error
let x = /*#__PURE__*/ React.createElement(OverWriteAttr, _extends({}, obj, {
    y: true,
    overwrite: "hi"
}, obj1));
let x1 = /*#__PURE__*/ React.createElement(OverWriteAttr, _extends({
    overwrite: "hi"
}, obj1, {
    x: 3
}, {
    y: true
}));
let x2 = /*#__PURE__*/ React.createElement(OverWriteAttr, _extends({}, anyobj, {
    x: 3
}));
let x3 = /*#__PURE__*/ React.createElement(OverWriteAttr, _extends({
    overwrite: "hi"
}, obj1, {
    y: true
}));
export { };
