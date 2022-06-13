import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _extends from "@swc/helpers/src/_extends.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var React = require("react"), B1 = function(_Component) {
    "use strict";
    _inherits(B1, _Component);
    var _super = _create_super(B1);
    function B1() {
        return _class_call_check(this, B1), _super.apply(this, arguments);
    }
    return B1.prototype.render = function() {
        return React.createElement("div", null, "hi");
    }, B1;
}(React.Component), B = function(_Component) {
    "use strict";
    _inherits(B, _Component);
    var _super = _create_super(B);
    function B() {
        return _class_call_check(this, B), _super.apply(this, arguments);
    }
    return B.prototype.render = function() {
        return React.createElement(B1, _extends({}, this.props, {
            x: "hi"
        }));
    }, B;
}(React.Component);
