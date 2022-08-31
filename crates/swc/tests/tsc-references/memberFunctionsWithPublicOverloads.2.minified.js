//// [memberFunctionsWithPublicOverloads.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
!function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    return _proto.foo = function(x, y) {}, _proto.bar = function(x, y) {}, C.foo = function(x, y) {}, C.bar = function(x, y) {}, C;
}();
