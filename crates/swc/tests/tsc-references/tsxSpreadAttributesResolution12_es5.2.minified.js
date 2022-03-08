import * as swcHelpers from "@swc/helpers";
var anyobj, React = require("react"), obj1 = {
    x: 2
}, OverWriteAttr = function(_Component) {
    "use strict";
    swcHelpers.inherits(OverWriteAttr, _Component);
    var _super = swcHelpers.createSuper(OverWriteAttr);
    function OverWriteAttr() {
        return swcHelpers.classCallCheck(this, OverWriteAttr), _super.apply(this, arguments);
    }
    return OverWriteAttr.prototype.render = function() {
        return React.createElement("div", null, "Hello");
    }, OverWriteAttr;
}(React.Component);
React.createElement(OverWriteAttr, swcHelpers.extends({}, {}, {
    y: !0,
    overwrite: "hi"
}, obj1)), React.createElement(OverWriteAttr, swcHelpers.extends({
    overwrite: "hi"
}, obj1, {
    x: 3
}, {
    y: !0
})), React.createElement(OverWriteAttr, swcHelpers.extends({}, anyobj, {
    x: 3
})), React.createElement(OverWriteAttr, swcHelpers.extends({
    overwrite: "hi"
}, obj1, {
    y: !0
}));
