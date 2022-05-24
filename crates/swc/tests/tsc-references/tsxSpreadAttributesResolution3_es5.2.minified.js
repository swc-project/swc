import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _extends from "@swc/helpers/lib/_extends.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var React = require("react"), Poisoned = function(_Component) {
    "use strict";
    _inherits(Poisoned, _Component);
    var _super = _create_super(Poisoned);
    function Poisoned() {
        return _class_call_check(this, Poisoned), _super.apply(this, arguments);
    }
    return Poisoned.prototype.render = function() {
        return React.createElement("div", null, "Hello");
    }, Poisoned;
}(React.Component);
_extends({}, {
    x: "hello world",
    y: 2
});
