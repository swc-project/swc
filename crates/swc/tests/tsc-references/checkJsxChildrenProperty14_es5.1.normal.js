import * as swcHelpers from "@swc/helpers";
// @filename: file.tsx
// @jsx: preserve
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
var React = require("react");
var Button = /*#__PURE__*/ function(_Component) {
    "use strict";
    swcHelpers.inherits(Button, _Component);
    var _super = swcHelpers.createSuper(Button);
    function Button() {
        swcHelpers.classCallCheck(this, Button);
        return _super.apply(this, arguments);
    }
    var _proto = Button.prototype;
    _proto.render = function render() {
        return /*#__PURE__*/ React.createElement("div", null, "My Button");
    };
    return Button;
}(React.Component);
function AnotherButton(p) {
    return /*#__PURE__*/ React.createElement("h1", null, "Just Another Button");
}
function Comp(p) {
    return /*#__PURE__*/ React.createElement("div", null, p.b);
}
// OK
var k1 = /*#__PURE__*/ React.createElement(Comp, {
    a: 10,
    b: "hi"
}, /*#__PURE__*/ React.createElement(React.Fragment, null), /*#__PURE__*/ React.createElement(Button, null), /*#__PURE__*/ React.createElement(AnotherButton, null));
var k2 = /*#__PURE__*/ React.createElement(Comp, {
    a: 10,
    b: "hi"
}, /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement(Button, null)), /*#__PURE__*/ React.createElement(AnotherButton, null));
var k3 = /*#__PURE__*/ React.createElement(Comp, {
    a: 10,
    b: "hi"
}, /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement(Button, null), /*#__PURE__*/ React.createElement(AnotherButton, null)));
function SingleChildComp(p) {
    return /*#__PURE__*/ React.createElement("div", null, p.b);
}
// OK
var k4 = /*#__PURE__*/ React.createElement(SingleChildComp, {
    a: 10,
    b: "hi"
}, /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement(Button, null), /*#__PURE__*/ React.createElement(AnotherButton, null)));
// Error
var k5 = /*#__PURE__*/ React.createElement(SingleChildComp, {
    a: 10,
    b: "hi"
}, /*#__PURE__*/ React.createElement(React.Fragment, null), /*#__PURE__*/ React.createElement(Button, null), /*#__PURE__*/ React.createElement(AnotherButton, null));
export { };
