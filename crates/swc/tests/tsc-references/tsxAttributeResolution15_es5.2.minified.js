import * as swcHelpers from "@swc/helpers";
var _this = this, React = require("react"), BigGreeter = function(_Component) {
    "use strict";
    swcHelpers.inherits(BigGreeter, _Component);
    var _super = swcHelpers.createSuper(BigGreeter);
    function BigGreeter() {
        return swcHelpers.classCallCheck(this, BigGreeter), _super.apply(this, arguments);
    }
    return swcHelpers.createClass(BigGreeter, [
        {
            key: "render",
            value: function() {
                return React.createElement("div", null, "Default hi");
            }
        }
    ]), BigGreeter;
}(React.Component);
React.createElement(BigGreeter, {
    prop1: "hello"
}), React.createElement(BigGreeter, {
    ref: function(input) {
        _this.textInput = input;
    }
}), React.createElement(BigGreeter, {
    "data-extra": "hi"
});
