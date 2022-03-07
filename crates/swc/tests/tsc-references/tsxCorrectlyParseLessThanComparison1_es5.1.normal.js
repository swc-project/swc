import * as swcHelpers from "@swc/helpers";
export var ShortDetails = /*#__PURE__*/ function(_Component) {
    "use strict";
    swcHelpers.inherits(ShortDetails, _Component);
    var _super = swcHelpers.createSuper(ShortDetails);
    function ShortDetails() {
        swcHelpers.classCallCheck(this, ShortDetails);
        return _super.apply(this, arguments);
    }
    var _proto = ShortDetails.prototype;
    _proto.render = function render() {
        if (this.props.id < 1) {
            return(/*#__PURE__*/ React.createElement("div", null));
        }
    };
    return ShortDetails;
}(React.Component);
