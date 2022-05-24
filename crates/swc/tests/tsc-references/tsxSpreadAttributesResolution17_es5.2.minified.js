import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _extends from "@swc/helpers/lib/_extends.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
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
