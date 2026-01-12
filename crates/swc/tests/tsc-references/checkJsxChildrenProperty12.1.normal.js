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
        var condition;
        if (condition) {
            return /*#__PURE__*/ React.createElement(InnerButton, this.props);
        } else {
            return /*#__PURE__*/ React.createElement(InnerButton, this.props, /*#__PURE__*/ React.createElement("div", null, "Hello World"));
        }
    };
    return Button;
}(React.Component);
var InnerButton = /*#__PURE__*/ function(_React_Component) {
    "use strict";
    _inherits(InnerButton, _React_Component);
    function InnerButton() {
        _class_call_check(this, InnerButton);
        return _call_super(this, InnerButton, arguments);
    }
    var _proto = InnerButton.prototype;
    _proto.render = function render() {
        return /*#__PURE__*/ React.createElement("button", null, "Hello");
    };
    return InnerButton;
}(React.Component);
export { };
