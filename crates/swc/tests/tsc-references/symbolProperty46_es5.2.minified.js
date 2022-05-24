import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
var _hasInstance = Symbol.hasInstance, _hasInstance1 = Symbol.hasInstance, C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return _create_class(C, [
        {
            key: _hasInstance,
            get: function() {
                return "";
            }
        },
        {
            key: _hasInstance1,
            set: function(x) {}
        }
    ]), C;
}();
(new C)[Symbol.hasInstance] = 0, (new C)[Symbol.hasInstance] = "";
