import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
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
