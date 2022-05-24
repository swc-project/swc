import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
export var ShortDetails = /*#__PURE__*/ function(_Component) {
    "use strict";
    _inherits(ShortDetails, _Component);
    var _super = _create_super(ShortDetails);
    function ShortDetails() {
        _class_call_check(this, ShortDetails);
        return _super.apply(this, arguments);
    }
    var _proto = ShortDetails.prototype;
    _proto.render = function render() {
        if (this.props.id < 1) {
            return /*#__PURE__*/ React.createElement("div", null);
        }
    };
    return ShortDetails;
}(React.Component);
