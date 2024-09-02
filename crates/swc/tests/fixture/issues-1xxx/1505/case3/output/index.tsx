var _call_super = require("@swc/helpers/_/_call_super");
var _class_call_check = require("@swc/helpers/_/_class_call_check");
var _define_property = require("@swc/helpers/_/_define_property");
var _inherits = require("@swc/helpers/_/_inherits");
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
        function _class() {
            _class_call_check._(this, _class);
            return _call_super._(this, _class, arguments);
        }
        return _class;
    }(Component);
    _define_property._(_class, "displayName", "x");
    return _class;
};
