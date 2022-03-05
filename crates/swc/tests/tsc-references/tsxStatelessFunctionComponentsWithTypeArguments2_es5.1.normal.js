import * as swcHelpers from "@swc/helpers";
// @filename: file.tsx
// @jsx: preserve
// @module: amd
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
var React = require('react');
// Error
function Bar(arg) {
    var a1 = /*#__PURE__*/ React.createElement(ComponentSpecific1, swcHelpers.extends({}, arg, {
        "ignore-prop": 10
    }));
}
// Error
function Baz(arg) {
    var a0 = /*#__PURE__*/ React.createElement(ComponentSpecific1, swcHelpers.extends({}, arg));
}
// Error
function createLink(func) {
    var o = /*#__PURE__*/ React.createElement(Link, {
        func: func
    });
}
// Error
var i = /*#__PURE__*/ React.createElement(InferParamComponent, {
    values: [
        1,
        2,
        3,
        4
    ],
    selectHandler: function(val) {}
});
export { };
