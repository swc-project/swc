import * as swcHelpers from "@swc/helpers";
export var Empty = function(_Component) {
    swcHelpers.inherits(Empty, _Component);
    var _super = swcHelpers.createSuper(Empty);
    function Empty() {
        return swcHelpers.classCallCheck(this, Empty), _super.apply(this, arguments);
    }
    return Empty.prototype.render = function() {
        return React.createElement("div", null, "Hello");
    }, Empty;
}(React.Component);
swcHelpers.extends({}, obj);
