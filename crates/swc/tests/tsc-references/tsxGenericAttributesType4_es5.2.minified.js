import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _extends from "@swc/helpers/lib/_extends.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
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
