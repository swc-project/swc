import * as swcHelpers from "@swc/helpers";
var React = require("react"), Opt = function(_Component) {
    "use strict";
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
React.createElement(Opt, swcHelpers.extends({}, {}, {
    x: 3
})), React.createElement(Opt, swcHelpers.extends({}, obj1, {
    x: "Hi"
})), React.createElement(Opt, swcHelpers.extends({}, obj1, {
    x: 3
})), React.createElement(Opt, {
    x: !0
});
