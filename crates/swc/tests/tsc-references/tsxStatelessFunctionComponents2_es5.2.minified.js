import * as swcHelpers from "@swc/helpers";
var React = require("react"), BigGreeter = function(_Component) {
    swcHelpers.inherits(BigGreeter, _Component);
    var _super = swcHelpers.createSuper(BigGreeter);
    function BigGreeter() {
        return swcHelpers.classCallCheck(this, BigGreeter), _super.apply(this, arguments);
    }
    return BigGreeter.prototype.render = function() {
        return React.createElement("div", null);
    }, BigGreeter;
}(React.Component);
