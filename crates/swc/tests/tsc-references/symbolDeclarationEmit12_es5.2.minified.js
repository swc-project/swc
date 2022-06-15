var M;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
!function(M) {
    var C = function() {
        "use strict";
        function C() {
            _class_call_check(this, C);
        }
        var _proto = C.prototype;
        return _proto[Symbol.toPrimitive] = function(x) {}, _proto[Symbol.isConcatSpreadable] = function() {}, _create_class(C, [
            {
                key: Symbol.toPrimitive,
                get: function() {}
            },
            {
                key: Symbol.toPrimitive,
                set: function(x) {}
            }
        ]), C;
    }();
    M.C = C;
}(M || (M = {}));
