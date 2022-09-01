//// [localTypes1.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
!function() {
    "use strict";
    function A() {
        var E, E1;
        _class_call_check(this, A), (E = E1 || (E1 = {}))[E.A = 0] = "A", E[E.B = 1] = "B", E[E.C = 2] = "C";
    }
    return A.prototype.m = function() {
        var E, E1;
        return (E = E1 || (E1 = {}))[E.A = 0] = "A", E[E.B = 1] = "B", E[E.C = 2] = "C", new function C() {
            _class_call_check(this, C);
        }();
    }, _create_class(A, [
        {
            key: "p",
            get: function() {
                var E, E1;
                return (E = E1 || (E1 = {}))[E.A = 0] = "A", E[E.B = 1] = "B", E[E.C = 2] = "C", new function C() {
                    _class_call_check(this, C);
                }();
            }
        }
    ]), A;
}();
