import * as swcHelpers from "@swc/helpers";
var React = require("react"), Poisoned = function(_Component) {
    "use strict";
    swcHelpers.inherits(Poisoned, _Component);
    var _super = swcHelpers.createSuper(Poisoned);
    function Poisoned() {
        return swcHelpers.classCallCheck(this, Poisoned), _super.apply(this, arguments);
    }
    return Poisoned.prototype.render = function() {
        return React.createElement("div", null, "Hello");
    }, Poisoned;
}(React.Component);
swcHelpers.extends({}, {
    x: "ok",
    y: "2"
}), swcHelpers.extends({}, {}), swcHelpers.extends({}, {
    x: 5,
    y: "2"
}), swcHelpers.extends({}, {
    x: 5,
    y: "2"
}, {
    X: "hi"
});
