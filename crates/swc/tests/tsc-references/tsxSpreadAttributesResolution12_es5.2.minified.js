import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _extends from "@swc/helpers/lib/_extends.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var anyobj, React = require("react"), obj1 = {
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
}, obj1), _extends({
    overwrite: "hi"
}, obj1, {
    x: 3
}, {
    y: !0
}), _extends({}, anyobj, {
    x: 3
}), _extends({
    overwrite: "hi"
}, obj1, {
    y: !0
});
