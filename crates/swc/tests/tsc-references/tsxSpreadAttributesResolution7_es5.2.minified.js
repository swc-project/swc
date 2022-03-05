import * as swcHelpers from "@swc/helpers";
var React = require("react"), TextComponent = function(_Component) {
    "use strict";
    swcHelpers.inherits(TextComponent, _Component);
    var _super = swcHelpers.createSuper(TextComponent);
    function TextComponent() {
        return swcHelpers.classCallCheck(this, TextComponent), _super.apply(this, arguments);
    }
    return swcHelpers.createClass(TextComponent, [
        {
            key: "render",
            value: function() {
                return React.createElement("span", null, "Some Text..");
            }
        }
    ]), TextComponent;
}(React.Component);
React.createElement(TextComponent, swcHelpers.extends({}, {
    editable: !1
})), React.createElement(TextComponent, swcHelpers.extends({}, {
    editable: !0,
    onEdit: function() {}
}));
