import * as swcHelpers from "@swc/helpers";
var React = require("react"), Button = function(_Component) {
    "use strict";
    swcHelpers.inherits(Button, _Component);
    var _super = swcHelpers.createSuper(Button);
    function Button() {
        return swcHelpers.classCallCheck(this, Button), _super.apply(this, arguments);
    }
    return Button.prototype.render = function() {
        return React.createElement(InnerButton, swcHelpers.extends({}, this.props, {
            children: "hi"
        }), React.createElement("div", null, "Hello World"));
    }, Button;
}(React.Component), InnerButton = function(_Component) {
    "use strict";
    swcHelpers.inherits(InnerButton, _Component);
    var _super = swcHelpers.createSuper(InnerButton);
    function InnerButton() {
        return swcHelpers.classCallCheck(this, InnerButton), _super.apply(this, arguments);
    }
    return InnerButton.prototype.render = function() {
        return React.createElement("button", null, "Hello");
    }, InnerButton;
}(React.Component);
