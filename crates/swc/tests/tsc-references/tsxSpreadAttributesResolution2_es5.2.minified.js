import * as swcHelpers from "@swc/helpers";
var React = require("react"), Poisoned = function(_Component) {
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
    x: "ok",
    y: "2"
})), React.createElement(Poisoned, swcHelpers.extends({}, {})), React.createElement(Poisoned, null), React.createElement(Poisoned, {
    x: !0,
    y: !0
}), React.createElement(Poisoned, swcHelpers.extends({}, {
    x: 5,
    y: "2"
})), React.createElement(Poisoned, swcHelpers.extends({}, {
    x: 5,
    y: "2"
}, {
    X: "hi"
}));
