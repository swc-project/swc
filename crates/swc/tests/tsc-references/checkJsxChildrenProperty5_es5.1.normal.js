import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
// @filename: file.tsx
// @jsx: preserve
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
var React = require("react");
var Button = /*#__PURE__*/ function(_Component) {
    "use strict";
    _inherits(Button, _Component);
    var _super = _create_super(Button);
    function Button() {
        _class_call_check(this, Button);
        return _super.apply(this, arguments);
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
