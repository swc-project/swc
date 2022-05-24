import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _extends from "@swc/helpers/lib/_extends.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
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
        var condition;
        if (condition) {
            return /*#__PURE__*/ React.createElement(InnerButton, _extends({}, this.props));
        } else {
            return /*#__PURE__*/ React.createElement(InnerButton, _extends({}, this.props), /*#__PURE__*/ React.createElement("div", null, "Hello World"));
        }
    };
    return Button;
}(React.Component);
var InnerButton = /*#__PURE__*/ function(_Component) {
    "use strict";
    _inherits(InnerButton, _Component);
    var _super = _create_super(InnerButton);
    function InnerButton() {
        _class_call_check(this, InnerButton);
        return _super.apply(this, arguments);
    }
    var _proto = InnerButton.prototype;
    _proto.render = function render() {
        return /*#__PURE__*/ React.createElement("button", null, "Hello");
    };
    return InnerButton;
}(React.Component);
export { };
