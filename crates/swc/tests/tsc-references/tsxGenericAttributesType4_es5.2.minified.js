import * as swcHelpers from "@swc/helpers";
var React = require("react"), B1 = function(_Component) {
    "use strict";
    swcHelpers.inherits(B1, _Component);
    var _super = swcHelpers.createSuper(B1);
    function B1() {
        return swcHelpers.classCallCheck(this, B1), _super.apply(this, arguments);
    }
    return B1.prototype.render = function() {
        return React.createElement("div", null, "hi");
    }, B1;
}(React.Component), B = function(_Component) {
    "use strict";
    swcHelpers.inherits(B, _Component);
    var _super = swcHelpers.createSuper(B);
    function B() {
        return swcHelpers.classCallCheck(this, B), _super.apply(this, arguments);
    }
    return B.prototype.render = function() {
        return React.createElement(B1, swcHelpers.extends({}, this.props, {
            x: "hi"
        }));
    }, B;
}(React.Component);
