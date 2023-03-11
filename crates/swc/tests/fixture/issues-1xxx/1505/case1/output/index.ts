import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _define_property from "@swc/helpers/src/_define_property.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var MyClass = function MyClass() {
    "use strict";
    _class_call_check(this, MyClass);
};
export var fn = function() {
    var _class = /*#__PURE__*/ function(MyClass) {
        "use strict";
        _inherits(_class, MyClass);
        var _super = _create_super(_class);
        function _class() {
            _class_call_check(this, _class);
            return _super.apply(this, arguments);
        }
        return _class;
    }(MyClass);
    _define_property(_class, "x", 5);
    return _class;
};
