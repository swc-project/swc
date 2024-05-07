var _class_call_check = require("@swc/helpers/_/_class_call_check");
var _define_property = require("@swc/helpers/_/_define_property");
var _inherits = require("@swc/helpers/_/_inherits");
var _create_super = require("@swc/helpers/_/_create_super");
var Component = function Component() {
    "use strict";
    _class_call_check._(this, Component);
};
var ComponentType = function ComponentType() {
    "use strict";
    _class_call_check._(this, ComponentType);
};
var withTeamsForUser = function(_WrappedComponent) {
    var _class = /*#__PURE__*/ function(Component) {
        "use strict";
        _inherits._(_class, Component);
        var _super = _create_super._(_class);
        function _class() {
            _class_call_check._(this, _class);
            return _super.apply(this, arguments);
        }
        return _class;
    }(Component);
    _define_property._(_class, "displayName", "x");
    return _class;
};
