import * as swcHelpers from "@swc/helpers";
var React = require("react"), Button = function(_Component) {
    "use strict";
    swcHelpers.inherits(Button, _Component);
    var _super = swcHelpers.createSuper(Button);
    function Button() {
        return swcHelpers.classCallCheck(this, Button), _super.apply(this, arguments);
    }
    return Button.prototype.render = function() {
        return React.createElement("div", null, "My Button");
    }, Button;
}(React.Component);
