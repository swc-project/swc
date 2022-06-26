import _extends from "@swc/helpers/src/_extends.mjs";
// @filename: file.tsx
// @jsx: preserve
// @strict: true
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
var React = require("react");
var props = {
    a: 1,
    b: 1
};
var Foo = function(props) {
    return /*#__PURE__*/ React.createElement("div", null, props.a);
};
// ok
var a1 = /*#__PURE__*/ React.createElement(Foo, _extends({}, props));
var a2 = /*#__PURE__*/ React.createElement(Foo, _extends({
    d: 1
}, props));
// error
var b1 = /*#__PURE__*/ React.createElement(Foo, _extends({
    a: 1
}, props));
var b2 = /*#__PURE__*/ React.createElement(Foo, _extends({
    a: 1,
    b: 2
}, props));
var b3 = /*#__PURE__*/ React.createElement(Foo, _extends({
    a: 1,
    d: 1
}, props, {
    d: 1
}));
var b4 = /*#__PURE__*/ React.createElement(Foo, _extends({
    a: 1,
    d: 1
}, props, {
    a: 1,
    d: 1
}));
export { };
