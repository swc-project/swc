import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
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
