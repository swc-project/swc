import _extends from "@swc/helpers/src/_extends.mjs";
// @filename: file.tsx
// @jsx: preserve
// @module: amd
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
var React = require("react");
var obj = {
    yy: 10,
    yy1: "hello"
};
var obj1 = {
    yy: true
};
var obj2 = {
    yy: 500,
    "ignore-prop": "hello"
};
var defaultObj;
// OK
var c1 = /*#__PURE__*/ React.createElement(OneThing, null);
var c2 = /*#__PURE__*/ React.createElement(OneThing, _extends({}, obj));
var c3 = /*#__PURE__*/ React.createElement(OneThing, _extends({}, {}));
var c4 = /*#__PURE__*/ React.createElement(OneThing, _extends({}, obj1, obj));
var c5 = /*#__PURE__*/ React.createElement(OneThing, _extends({}, obj1, {
    yy: 42
}, {
    yy1: "hi"
}));
var c6 = /*#__PURE__*/ React.createElement(OneThing, _extends({}, obj1, {
    yy: 10000,
    yy1: "true"
}));
var c7 = /*#__PURE__*/ React.createElement(OneThing, _extends({}, defaultObj, {
    yy: true
}, obj)); // No error. should pick second overload
var c8 = /*#__PURE__*/ React.createElement(OneThing, {
    "ignore-prop": 100
});
var c9 = /*#__PURE__*/ React.createElement(OneThing, _extends({}, {
    "ignore-prop": 200
}));
var c10 = /*#__PURE__*/ React.createElement(OneThing, _extends({}, obj2, {
    yy1: "boo"
}));
export { };
