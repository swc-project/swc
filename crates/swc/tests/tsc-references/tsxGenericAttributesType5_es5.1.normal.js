import * as swcHelpers from "@swc/helpers";
// @filename: file.tsx
// @jsx: preserve
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
var React = require('react');
var B1 = /*#__PURE__*/ function(_Component) {
    "use strict";
    swcHelpers.inherits(B1, _Component);
    var _super = swcHelpers.createSuper(B1);
    function B1() {
        swcHelpers.classCallCheck(this, B1);
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
    swcHelpers.inherits(B, _Component);
    var _super = swcHelpers.createSuper(B);
    function B() {
        swcHelpers.classCallCheck(this, B);
        return _super.apply(this, arguments);
    }
    var _proto = B.prototype;
    _proto.render = function render() {
        return /*#__PURE__*/ React.createElement(B1, swcHelpers.extends({}, this.props, {
            x: "hi"
        }));
    };
    return B;
}(React.Component);
export { };
