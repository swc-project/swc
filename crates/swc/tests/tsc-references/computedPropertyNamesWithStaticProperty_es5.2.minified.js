import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _class_name_tdz_error from "@swc/helpers/lib/_class_name_tdz_error.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
var _staticProp = (_class_name_tdz_error("C"), C).staticProp, _staticProp1 = (_class_name_tdz_error("C"), C).staticProp, _staticProp2 = (_class_name_tdz_error("C"), C).staticProp, C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype[_staticProp2] = function() {}, _create_class(C, [
        {
            key: _staticProp,
            get: function() {
                return "hello";
            }
        },
        {
            key: _staticProp1,
            set: function(x) {}
        }
    ]), C;
}();
C.staticProp = 10;
