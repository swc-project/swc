//// [computedPropertyNames34_ES5.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _define_property from "@swc/helpers/src/_define_property.mjs";
!function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.bar = function() {
        return _define_property({}, "", function() {}), 0;
    }, C;
}();
