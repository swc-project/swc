import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _extends from "@swc/helpers/lib/_extends.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var React = require("react"), Button = function(_Component) {
    "use strict";
    _inherits(Button, _Component);
    var _super = _create_super(Button);
    function Button() {
        return _class_call_check(this, Button), _super.apply(this, arguments);
    }
    return Button.prototype.render = function() {
        return React.createElement(InnerButton, _extends({}, this.props, {
            children: "hi"
        }), React.createElement("div", null, "Hello World"));
    }, Button;
}(React.Component), InnerButton = function(_Component) {
    "use strict";
    _inherits(InnerButton, _Component);
    var _super = _create_super(InnerButton);
    function InnerButton() {
        return _class_call_check(this, InnerButton), _super.apply(this, arguments);
    }
    return InnerButton.prototype.render = function() {
        return React.createElement("button", null, "Hello");
    }, InnerButton;
}(React.Component);
