import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _extends from "@swc/helpers/lib/_extends.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var React = require("react"), TextComponent = function(_Component) {
    "use strict";
    _inherits(TextComponent, _Component);
    var _super = _create_super(TextComponent);
    function TextComponent() {
        return _class_call_check(this, TextComponent), _super.apply(this, arguments);
    }
    return TextComponent.prototype.render = function() {
        return React.createElement("span", null, "Some Text..");
    }, TextComponent;
}(React.Component);
_extends({}, {
    editable: !1
}), _extends({}, {
    editable: !0,
    onEdit: function() {}
});
