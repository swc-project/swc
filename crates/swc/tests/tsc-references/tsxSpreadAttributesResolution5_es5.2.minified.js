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
    x: "hello world",
    y: 2
});
var EmptyProp = function(_Component) {
    "use strict";
    swcHelpers.inherits(EmptyProp, _Component);
    var _super = swcHelpers.createSuper(EmptyProp);
    function EmptyProp() {
        return swcHelpers.classCallCheck(this, EmptyProp), _super.apply(this, arguments);
    }
    return EmptyProp.prototype.render = function() {
        return React.createElement("div", null, "Default hi");
    }, EmptyProp;
}(React.Component);
swcHelpers.extends({}, {
    prop1: !1
});
