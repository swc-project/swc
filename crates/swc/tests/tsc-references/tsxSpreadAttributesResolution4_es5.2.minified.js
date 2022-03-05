import * as swcHelpers from "@swc/helpers";
var j, _this = this, React = require("react"), Poisoned = function(_Component) {
    "use strict";
    swcHelpers.inherits(Poisoned, _Component);
    var _super = swcHelpers.createSuper(Poisoned);
    function Poisoned() {
        return swcHelpers.classCallCheck(this, Poisoned), _super.apply(this, arguments);
    }
    return swcHelpers.createClass(Poisoned, [
        {
            key: "render",
            value: function() {
                return React.createElement("div", null, "Hello");
            }
        }
    ]), Poisoned;
}(React.Component);
React.createElement(Poisoned, swcHelpers.extends({}, {
    x: "hello world",
    y: 2
}));
var EmptyProp = function(_Component) {
    "use strict";
    swcHelpers.inherits(EmptyProp, _Component);
    var _super = swcHelpers.createSuper(EmptyProp);
    function EmptyProp() {
        return swcHelpers.classCallCheck(this, EmptyProp), _super.apply(this, arguments);
    }
    return swcHelpers.createClass(EmptyProp, [
        {
            key: "render",
            value: function() {
                return React.createElement("div", null, "Default hi");
            }
        }
    ]), EmptyProp;
}(React.Component);
React.createElement(EmptyProp, swcHelpers.extends({}, {})), React.createElement(EmptyProp, swcHelpers.extends({}, j)), React.createElement(EmptyProp, swcHelpers.extends({}, {
    ref: function(input) {
        _this.textInput = input;
    }
})), React.createElement(EmptyProp, {
    "data-prop": !0
}), React.createElement(EmptyProp, swcHelpers.extends({}, {
    "data-prop": !0
}));
