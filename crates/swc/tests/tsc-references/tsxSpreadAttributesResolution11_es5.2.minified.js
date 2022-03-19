import * as swcHelpers from "@swc/helpers";
var anyobj, React = require('react'), obj1 = {
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
swcHelpers.extends({}, {}, {
    y: !0,
    overwrite: "hi"
}, obj1), swcHelpers.extends({}, obj1, {
    y: !0,
    overwrite: "hi"
}), swcHelpers.extends({
    x: 3,
    overwrite: "hi"
}, obj1, {
    y: !0
}), swcHelpers.extends({
    overwrite: "hi"
}, obj1, {
    x: 3
}, {
    y: !0,
    x: 2,
    overwrite: "world"
}), swcHelpers.extends({}, {
    x: 2
}, {
    overwrite: "world"
}, {
    y: !0
}), swcHelpers.extends({}, anyobj);
