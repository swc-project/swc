import * as swcHelpers from "@swc/helpers";
// @filename: file.tsx
// @jsx: preserve
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
var React = require('react');
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
        var condition;
        if (condition) {
            return /*#__PURE__*/ React.createElement(InnerButton, swcHelpers.extends({}, this.props));
        } else {
            return /*#__PURE__*/ React.createElement(InnerButton, swcHelpers.extends({}, this.props), /*#__PURE__*/ React.createElement("div", null, "Hello World"));
        }
    };
    return Button;
}(React.Component);
var InnerButton = /*#__PURE__*/ function(_Component) {
    "use strict";
    swcHelpers.inherits(InnerButton, _Component);
    var _super = swcHelpers.createSuper(InnerButton);
    function InnerButton() {
        swcHelpers.classCallCheck(this, InnerButton);
        return _super.apply(this, arguments);
    }
    var _proto = InnerButton.prototype;
    _proto.render = function render() {
        return /*#__PURE__*/ React.createElement("button", null, "Hello");
    };
    return InnerButton;
}(React.Component);
export { };
