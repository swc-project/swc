//// [file.tsx]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
var Opt = /*#__PURE__*/ function(_React_Component) {
    "use strict";
    _inherits(Opt, _React_Component);
    function Opt() {
        _class_call_check(this, Opt);
        return _call_super(this, Opt, arguments);
    }
    var _proto = Opt.prototype;
    _proto.render = function render() {
        return /*#__PURE__*/ React.createElement("div", null, "Hello");
    };
    return Opt;
}(React.Component);
var obj = {};
var obj1 = {
    x: 2
};
// Error
var y = /*#__PURE__*/ React.createElement(Opt, _object_spread_props(_object_spread({}, obj), {
    x: 3
}));
var y1 = /*#__PURE__*/ React.createElement(Opt, _object_spread_props(_object_spread({}, obj1), {
    x: "Hi"
}));
var y2 = /*#__PURE__*/ React.createElement(Opt, _object_spread_props(_object_spread({}, obj1), {
    x: 3
}));
var y3 = /*#__PURE__*/ React.createElement(Opt, {
    x: true
});
export { };
