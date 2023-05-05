//// [tsxCorrectlyParseLessThanComparison1.tsx]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
export var ShortDetails = /*#__PURE__*/ function(_React_Component) {
    "use strict";
    _inherits(ShortDetails, _React_Component);
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
