import * as swcHelpers from "@swc/helpers";
// @filename: file.tsx
// @jsx: preserve
// @strict: true
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
const React = require('react');
const props = {
    a: 1,
    b: 1
};
const Foo = (props1)=>/*#__PURE__*/ React.createElement("div", null, props1.a);
// ok
const a1 = /*#__PURE__*/ React.createElement(Foo, swcHelpers.extends({}, props));
const a2 = /*#__PURE__*/ React.createElement(Foo, swcHelpers.extends({
    d: 1
}, props));
// error
const b1 = /*#__PURE__*/ React.createElement(Foo, swcHelpers.extends({
    a: 1
}, props));
const b2 = /*#__PURE__*/ React.createElement(Foo, swcHelpers.extends({
    a: 1,
    b: 2
}, props));
const b3 = /*#__PURE__*/ React.createElement(Foo, swcHelpers.extends({
    a: 1,
    d: 1
}, props, {
    d: 1
}));
const b4 = /*#__PURE__*/ React.createElement(Foo, swcHelpers.extends({
    a: 1,
    d: 1
}, props, {
    a: 1,
    d: 1
}));
export { };
