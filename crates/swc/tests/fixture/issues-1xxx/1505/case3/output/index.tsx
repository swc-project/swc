import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var Component = function Component() {
    "use strict";
    _class_call_check(this, Component);
};
var ComponentType = function ComponentType() {
    "use strict";
    _class_call_check(this, ComponentType);
};
var withTeamsForUser = function(_WrappedComponent) {
    var _class = /*#__PURE__*/ function(Component) {
        "use strict";
        _inherits(_class, Component);
        function _class() {
            _class_call_check(this, _class);
            return _call_super(this, _class, arguments);
        }
        return _class;
    }(Component);
    _define_property(_class, "displayName", "x");
    return _class;
};
