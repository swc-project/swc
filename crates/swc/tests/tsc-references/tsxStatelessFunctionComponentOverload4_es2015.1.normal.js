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
let obj2;
// Error
const c0 = /*#__PURE__*/ React.createElement(OneThing, {
    extraProp: true
}); // extra property;
const c1 = /*#__PURE__*/ React.createElement(OneThing, {
    yy: 10
}); // missing property;
const c2 = /*#__PURE__*/ React.createElement(OneThing, _extends({}, obj, {
    yy1: true
})); // type incompatible;
const c3 = /*#__PURE__*/ React.createElement(OneThing, _extends({}, obj, {
    extra: "extra attr"
})); //  This is OK because all attribute are spread
const c4 = /*#__PURE__*/ React.createElement(OneThing, _extends({}, obj, {
    y1: 10000
})); // extra property;
const c5 = /*#__PURE__*/ React.createElement(OneThing, _extends({}, obj, {
    yy: true
})); // type incompatible;
const c6 = /*#__PURE__*/ React.createElement(OneThing, _extends({}, obj2, {
    extra: "extra attr"
})); // Should error as there is extra attribute that doesn't match any. Current it is not
const c7 = /*#__PURE__*/ React.createElement(OneThing, _extends({}, obj2, {
    yy: true
})); // Should error as there is extra attribute that doesn't match any. Current it is not
// Error
const d1 = /*#__PURE__*/ React.createElement(TestingOneThing, {
    "extra-data": true
});
const d2 = /*#__PURE__*/ React.createElement(TestingOneThing, {
    yy: "hello",
    direction: "left"
});
// Error
const e1 = /*#__PURE__*/ React.createElement(TestingOptional, {
    y1: true,
    y3: "hello"
});
const e2 = /*#__PURE__*/ React.createElement(TestingOptional, {
    y1: "hello",
    y2: 1000,
    y3: true
});
const e3 = /*#__PURE__*/ React.createElement(TestingOptional, {
    y1: "hello",
    y2: 1000,
    children: "hi"
});
const e4 = /*#__PURE__*/ React.createElement(TestingOptional, {
    y1: "hello",
    y2: 1000
}, "Hi");
export { };
