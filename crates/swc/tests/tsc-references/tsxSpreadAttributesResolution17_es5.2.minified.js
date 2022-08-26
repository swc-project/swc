import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _extends from "@swc/helpers/src/_extends.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
export var Empty = function(_Component) {
    "use strict";
    _inherits(Empty, _Component);
    var _super = _create_super(Empty);
    function Empty() {
        return _class_call_check(this, Empty), _super.apply(this, arguments);
    }
    return Empty.prototype.render = function() {
        return React.createElement("div", null, "Hello");
    }, Empty;
}(React.Component);
_extends({}, obj);
