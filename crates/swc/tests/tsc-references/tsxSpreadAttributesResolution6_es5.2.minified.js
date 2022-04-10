import * as swcHelpers from "@swc/helpers";
var React = require("react"), TextComponent = function(_Component) {
    swcHelpers.inherits(TextComponent, _Component);
    var _super = swcHelpers.createSuper(TextComponent);
    function TextComponent() {
        return swcHelpers.classCallCheck(this, TextComponent), _super.apply(this, arguments);
    }
    return TextComponent.prototype.render = function() {
        return React.createElement("span", null, "Some Text..");
    }, TextComponent;
}(React.Component);
