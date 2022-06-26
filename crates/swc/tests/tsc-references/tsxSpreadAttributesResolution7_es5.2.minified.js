import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _extends from "@swc/helpers/src/_extends.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
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
