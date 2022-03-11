import * as swcHelpers from "@swc/helpers";
var _this = this;
// @filename: file.tsx
// @jsx: preserve
// @noLib: true
// @skipLibCheck: true
// @noImplicitAny: true
// @libFiles: react.d.ts,lib.d.ts
var React = require('react');
var BigGreeter = /*#__PURE__*/ function(_Component) {
    "use strict";
    swcHelpers.inherits(BigGreeter, _Component);
    var _super = swcHelpers.createSuper(BigGreeter);
    function BigGreeter() {
        swcHelpers.classCallCheck(this, BigGreeter);
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
