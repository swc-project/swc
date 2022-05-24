import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
export var ShortDetails = function(_Component) {
    "use strict";
    _inherits(ShortDetails, _Component);
    var _super = _create_super(ShortDetails);
    function ShortDetails() {
        return _class_call_check(this, ShortDetails), _super.apply(this, arguments);
    }
    return ShortDetails.prototype.render = function() {
        if (this.props.id < 1) return React.createElement("div", null);
    }, ShortDetails;
}(React.Component);
