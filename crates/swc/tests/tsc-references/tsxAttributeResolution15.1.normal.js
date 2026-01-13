//// [file.tsx]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var _this = this;
var BigGreeter = /*#__PURE__*/ function(_React_Component) {
    "use strict";
    _inherits(BigGreeter, _React_Component);
    function BigGreeter() {
        _class_call_check(this, BigGreeter);
        return _call_super(this, BigGreeter, arguments);
    }
    var _proto = BigGreeter.prototype;
    _proto.render = function render() {
        return /*#__PURE__*/ React.createElement("div", null, "Default hi");
    };
    return BigGreeter;
}(React.Component);
// Error
var a = /*#__PURE__*/ React.createElement(BigGreeter, {
    prop1: "hello"
});
// OK
var b = /*#__PURE__*/ React.createElement(BigGreeter, {
    ref: function(input) {
        _this.textInput = input;
    }
});
var c = /*#__PURE__*/ React.createElement(BigGreeter, {
    "data-extra": "hi"
});
export { };
