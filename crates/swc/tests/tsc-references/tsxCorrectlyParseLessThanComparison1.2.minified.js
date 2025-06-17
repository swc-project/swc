//// [tsxCorrectlyParseLessThanComparison1.tsx]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
export var ShortDetails = /*#__PURE__*/ function(_React_Component) {
    function ShortDetails() {
        return _class_call_check(this, ShortDetails), _call_super(this, ShortDetails, arguments);
    }
    return _inherits(ShortDetails, _React_Component), ShortDetails.prototype.render = function() {
        if (this.props.id < 1) return React.createElement("div", null);
    }, ShortDetails;
}(React.Component);
