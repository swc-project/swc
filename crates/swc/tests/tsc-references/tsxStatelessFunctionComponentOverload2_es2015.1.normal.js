import _extends from "@swc/helpers/src/_extends.mjs";
// @filename: file.tsx
// @jsx: preserve
// @module: amd
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
const React = require('react');
let obj = {
    yy: 10,
    yy1: "hello"
};
let obj1 = {
    yy: true
};
let obj2 = {
    yy: 500,
    "ignore-prop": "hello"
};
let defaultObj;
// OK
const c1 = /*#__PURE__*/ React.createElement(OneThing, null);
const c2 = /*#__PURE__*/ React.createElement(OneThing, _extends({}, obj));
const c3 = /*#__PURE__*/ React.createElement(OneThing, _extends({}, {}));
const c4 = /*#__PURE__*/ React.createElement(OneThing, _extends({}, obj1, obj));
const c5 = /*#__PURE__*/ React.createElement(OneThing, _extends({}, obj1, {
    yy: 42
}, {
    yy1: "hi"
}));
const c6 = /*#__PURE__*/ React.createElement(OneThing, _extends({}, obj1, {
    yy: 10000,
    yy1: "true"
}));
const c7 = /*#__PURE__*/ React.createElement(OneThing, _extends({}, defaultObj, {
    yy: true
}, obj)); // No error. should pick second overload
const c8 = /*#__PURE__*/ React.createElement(OneThing, {
    "ignore-prop": 100
});
const c9 = /*#__PURE__*/ React.createElement(OneThing, _extends({}, {
    "ignore-prop": 200
}));
const c10 = /*#__PURE__*/ React.createElement(OneThing, _extends({}, obj2, {
    yy1: "boo"
}));
export { };
