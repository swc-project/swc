import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _extends from "@swc/helpers/lib/_extends.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
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
    _inherits(OverWriteAttr, _Component);
    var _super = _create_super(OverWriteAttr);
    function OverWriteAttr() {
        _class_call_check(this, OverWriteAttr);
        return _super.apply(this, arguments);
    }
    var _proto = OverWriteAttr.prototype;
    _proto.render = function render() {
        return /*#__PURE__*/ React.createElement("div", null, "Hello");
    };
    return OverWriteAttr;
}(React.Component);
// OK
var x = /*#__PURE__*/ React.createElement(OverWriteAttr, _extends({}, obj, {
    y: true,
    overwrite: "hi"
}, obj1));
var x1 = /*#__PURE__*/ React.createElement(OverWriteAttr, _extends({}, obj1, obj3));
export { };
