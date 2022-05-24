import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var React = require("react"), BigGreeter = function(_Component) {
    "use strict";
    _inherits(BigGreeter, _Component);
    var _super = _create_super(BigGreeter);
    function BigGreeter() {
        return _class_call_check(this, BigGreeter), _super.apply(this, arguments);
    }
    return BigGreeter.prototype.render = function() {
        return React.createElement("div", null);
    }, BigGreeter;
}(React.Component);
