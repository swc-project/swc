//// [file.tsx]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var Poisoned = /*#__PURE__*/ function(_React_Component) {
    "use strict";
    _inherits(Poisoned, _React_Component);
    function Poisoned() {
        _class_call_check(this, Poisoned);
        return _call_super(this, Poisoned, arguments);
    }
    var _proto = Poisoned.prototype;
    _proto.render = function render() {
        return /*#__PURE__*/ React.createElement("div", null, "Hello");
    };
    return Poisoned;
}(React.Component);
var obj = {
    x: "hello world",
    y: 2
};
// Error as "obj" has type { x: string; y: number }
var p = /*#__PURE__*/ React.createElement(Poisoned, obj);
var EmptyProp = /*#__PURE__*/ function(_React_Component) {
    "use strict";
    _inherits(EmptyProp, _React_Component);
    function EmptyProp() {
        _class_call_check(this, EmptyProp);
        return _call_super(this, EmptyProp, arguments);
    }
    var _proto = EmptyProp.prototype;
    _proto.render = function render() {
        return /*#__PURE__*/ React.createElement("div", null, "Default hi");
    };
    return EmptyProp;
}(React.Component);
var o = {
    prop1: false
};
// Ok
var e = /*#__PURE__*/ React.createElement(EmptyProp, o);
export { };
