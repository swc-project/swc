import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _extends from "@swc/helpers/lib/_extends.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
export var Empty = /*#__PURE__*/ function(_Component) {
    "use strict";
    _inherits(Empty, _Component);
    var _super = _create_super(Empty);
    function Empty() {
        _class_call_check(this, Empty);
        return _super.apply(this, arguments);
    }
    var _proto = Empty.prototype;
    _proto.render = function render() {
        return /*#__PURE__*/ React.createElement("div", null, "Hello");
    };
    return Empty;
}(React.Component);
// OK
var unionedSpread = /*#__PURE__*/ React.createElement(Empty, _extends({}, obj));
