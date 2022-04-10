import * as swcHelpers from "@swc/helpers";
export var ShortDetails = function(_Component) {
    swcHelpers.inherits(ShortDetails, _Component);
    var _super = swcHelpers.createSuper(ShortDetails);
    function ShortDetails() {
        return swcHelpers.classCallCheck(this, ShortDetails), _super.apply(this, arguments);
    }
    return ShortDetails.prototype.render = function() {
        if (this.props.id < 1) return React.createElement("div", null);
    }, ShortDetails;
}(React.Component);
