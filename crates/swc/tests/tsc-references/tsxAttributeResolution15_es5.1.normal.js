import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var _this = this;
// @filename: file.tsx
// @jsx: preserve
// @noLib: true
// @skipLibCheck: true
// @noImplicitAny: true
// @libFiles: react.d.ts,lib.d.ts
var React = require("react");
var BigGreeter = /*#__PURE__*/ function(_Component) {
    "use strict";
    _inherits(BigGreeter, _Component);
    var _super = _create_super(BigGreeter);
    function BigGreeter() {
        _class_call_check(this, BigGreeter);
        return _super.apply(this, arguments);
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
