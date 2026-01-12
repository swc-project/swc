//// [file.tsx]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var Button = /*#__PURE__*/ function(_React_Component) {
    "use strict";
    _inherits(Button, _React_Component);
    function Button() {
        _class_call_check(this, Button);
        return _call_super(this, Button, arguments);
    }
    var _proto = Button.prototype;
    _proto.render = function render() {
        return /*#__PURE__*/ React.createElement("div", null, "My Button");
    };
    return Button;
}(React.Component);
function Comp(p) {
    return /*#__PURE__*/ React.createElement("div", null, p.b);
}
// Error: no children specified
var k = /*#__PURE__*/ React.createElement(Comp, {
    a: 10,
    b: "hi"
});
// Error: JSX.element is not the same as JSX.ElementClass
var k1 = /*#__PURE__*/ React.createElement(Comp, {
    a: 10,
    b: "hi"
}, /*#__PURE__*/ React.createElement(Button, null));
var k2 = /*#__PURE__*/ React.createElement(Comp, {
    a: 10,
    b: "hi"
}, Button);
export { };
