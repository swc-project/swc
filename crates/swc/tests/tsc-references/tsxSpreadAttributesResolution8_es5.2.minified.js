import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _extends from "@swc/helpers/src/_extends.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var React = require("react"), obj1 = {
    x: 2
}, OverWriteAttr = function(_Component) {
    "use strict";
    _inherits(OverWriteAttr, _Component);
    var _super = _create_super(OverWriteAttr);
    function OverWriteAttr() {
        return _class_call_check(this, OverWriteAttr), _super.apply(this, arguments);
    }
    return OverWriteAttr.prototype.render = function() {
        return React.createElement("div", null, "Hello");
    }, OverWriteAttr;
}(React.Component);
_extends({}, {}, {
    y: !0,
    overwrite: "hi"
}, obj1), _extends({}, obj1, {
    y: !0,
    overwrite: "hi"
});
