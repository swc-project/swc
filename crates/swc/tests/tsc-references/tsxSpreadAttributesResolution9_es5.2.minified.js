import * as swcHelpers from "@swc/helpers";
var React = require("react"), Opt = function(_Component) {
    swcHelpers.inherits(Opt, _Component);
    var _super = swcHelpers.createSuper(Opt);
    function Opt() {
        return swcHelpers.classCallCheck(this, Opt), _super.apply(this, arguments);
    }
    return Opt.prototype.render = function() {
        return React.createElement("div", null, "Hello");
    }, Opt;
}(React.Component), obj1 = {
    x: 2
};
swcHelpers.extends({}, {}), swcHelpers.extends({}, obj1), swcHelpers.extends({}, obj1, {
    y: !0
});
