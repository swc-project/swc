//// [tsxCorrectlyParseLessThanComparison1.tsx]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
export var ShortDetails = /*#__PURE__*/ function(_React_Component) {
    "use strict";
    _inherits(ShortDetails, _React_Component);
    function ShortDetails() {
        _class_call_check(this, ShortDetails);
        return _call_super(this, ShortDetails, arguments);
    }
    var _proto = ShortDetails.prototype;
    _proto.render = function render() {
        if (this.props.id < 1) {
            return /*#__PURE__*/ React.createElement("div", null);
        }
    };
    return ShortDetails;
}(React.Component);
