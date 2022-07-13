// @filename: file.tsx
// @jsx: preserve
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _extends from "@swc/helpers/src/_extends.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var React = require("react");
var B1 = /*#__PURE__*/ function(_Component) {
    "use strict";
    _inherits(B1, _Component);
    var _super = _create_super(B1);
    function B1() {
        _class_call_check(this, B1);
        return _super.apply(this, arguments);
    }
    var _proto = B1.prototype;
    _proto.render = function render() {
        return /*#__PURE__*/ React.createElement("div", null, "hi");
    };
    return B1;
}(React.Component);
var B = /*#__PURE__*/ function(_Component) {
    "use strict";
    _inherits(B, _Component);
    var _super = _create_super(B);
    function B() {
        _class_call_check(this, B);
        return _super.apply(this, arguments);
    }
    var _proto = B.prototype;
    _proto.render = function render() {
        return /*#__PURE__*/ React.createElement(B1, _extends({}, this.props, {
            x: "hi"
        }));
    };
    return B;
}(React.Component);
export { };
