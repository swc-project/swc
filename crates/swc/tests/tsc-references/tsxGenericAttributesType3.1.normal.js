//// [file.tsx]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
var B1 = /*#__PURE__*/ function(_React_Component) {
    "use strict";
    _inherits(B1, _React_Component);
    function B1() {
        _class_call_check(this, B1);
        return _call_super(this, B1, arguments);
    }
    var _proto = B1.prototype;
    _proto.render = function render() {
        return /*#__PURE__*/ React.createElement("div", null, "hi");
    };
    return B1;
}(React.Component);
var B = /*#__PURE__*/ function(_React_Component) {
    "use strict";
    _inherits(B, _React_Component);
    function B() {
        _class_call_check(this, B);
        return _call_super(this, B, arguments);
    }
    var _proto = B.prototype;
    _proto.render = function render() {
        return /*#__PURE__*/ React.createElement(B1, _object_spread_props(_object_spread({}, this.props), {
            x: "hi"
        }));
    };
    return B;
}(React.Component);
export { };
