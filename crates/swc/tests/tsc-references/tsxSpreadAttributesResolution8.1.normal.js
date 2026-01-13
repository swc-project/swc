//// [file.tsx]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
var obj = {};
var obj1 = {
    x: 2
};
var obj3 = {
    y: true,
    overwrite: "hi"
};
var OverWriteAttr = /*#__PURE__*/ function(_React_Component) {
    "use strict";
    _inherits(OverWriteAttr, _React_Component);
    function OverWriteAttr() {
        _class_call_check(this, OverWriteAttr);
        return _call_super(this, OverWriteAttr, arguments);
    }
    var _proto = OverWriteAttr.prototype;
    _proto.render = function render() {
        return /*#__PURE__*/ React.createElement("div", null, "Hello");
    };
    return OverWriteAttr;
}(React.Component);
// OK
var x = /*#__PURE__*/ React.createElement(OverWriteAttr, _object_spread(_object_spread_props(_object_spread({}, obj), {
    y: true,
    overwrite: "hi"
}), obj1));
var x1 = /*#__PURE__*/ React.createElement(OverWriteAttr, _object_spread({}, obj1, obj3));
export { };
