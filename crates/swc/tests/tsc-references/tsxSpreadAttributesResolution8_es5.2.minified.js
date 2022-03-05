import * as swcHelpers from "@swc/helpers";
var React = require("react"), obj1 = {
    x: 2
}, OverWriteAttr = function(_Component) {
    "use strict";
    swcHelpers.inherits(OverWriteAttr, _Component);
    var _super = swcHelpers.createSuper(OverWriteAttr);
    function OverWriteAttr() {
        return swcHelpers.classCallCheck(this, OverWriteAttr), _super.apply(this, arguments);
    }
    return swcHelpers.createClass(OverWriteAttr, [
        {
            key: "render",
            value: function() {
                return React.createElement("div", null, "Hello");
            }
        }
    ]), OverWriteAttr;
}(React.Component);
React.createElement(OverWriteAttr, swcHelpers.extends({}, {}, {
    y: !0,
    overwrite: "hi"
}, obj1)), React.createElement(OverWriteAttr, swcHelpers.extends({}, obj1, {
    y: !0,
    overwrite: "hi"
}));
