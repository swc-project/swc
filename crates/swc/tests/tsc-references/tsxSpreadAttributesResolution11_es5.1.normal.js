import * as swcHelpers from "@swc/helpers";
// @filename: file.tsx
// @jsx: preserve
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
var React = require("react");
var obj = {};
var obj1 = {
    x: 2
};
var obj3 = {
    y: true,
    overwrite: "hi"
};
var OverWriteAttr = /*#__PURE__*/ function(_Component) {
    "use strict";
    swcHelpers.inherits(OverWriteAttr, _Component);
    var _super = swcHelpers.createSuper(OverWriteAttr);
    function OverWriteAttr() {
        swcHelpers.classCallCheck(this, OverWriteAttr);
        return _super.apply(this, arguments);
    }
    var _proto = OverWriteAttr.prototype;
    _proto.render = function render() {
        return /*#__PURE__*/ React.createElement("div", null, "Hello");
    };
    return OverWriteAttr;
}(React.Component);
var anyobj;
// OK
var x = /*#__PURE__*/ React.createElement(OverWriteAttr, swcHelpers.extends({}, obj, {
    y: true,
    overwrite: "hi"
}, obj1));
var x1 = /*#__PURE__*/ React.createElement(OverWriteAttr, swcHelpers.extends({}, obj1, obj3));
var x2 = /*#__PURE__*/ React.createElement(OverWriteAttr, swcHelpers.extends({
    x: 3,
    overwrite: "hi"
}, obj1, {
    y: true
}));
var x3 = /*#__PURE__*/ React.createElement(OverWriteAttr, swcHelpers.extends({
    overwrite: "hi"
}, obj1, {
    x: 3
}, {
    y: true,
    x: 2,
    overwrite: "world"
}));
var x4 = /*#__PURE__*/ React.createElement(OverWriteAttr, swcHelpers.extends({}, {
    x: 2
}, {
    overwrite: "world"
}, {
    y: true
}));
var x5 = /*#__PURE__*/ React.createElement(OverWriteAttr, swcHelpers.extends({}, anyobj));
export { };
