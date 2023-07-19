//// [tsxCorrectlyParseLessThanComparison1.tsx]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
export var ShortDetails = function(_React_Component) {
    _inherits(ShortDetails, _React_Component);
    var _super = _create_super(ShortDetails);
    function ShortDetails() {
        return _class_call_check(this, ShortDetails), _super.apply(this, arguments);
    }
    return ShortDetails.prototype.render = function() {
        if (this.props.id < 1) return React.createElement("div", null);
    }, ShortDetails;
}(React.Component);
