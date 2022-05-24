import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _define_property from "@swc/helpers/lib/_define_property.js";
var C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.bar = function() {
        return _define_property({}, "", function() {}), 0;
    }, C;
}();
