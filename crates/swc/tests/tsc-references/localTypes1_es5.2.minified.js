import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var A = function() {
    "use strict";
    function A() {
        _class_call_check(this, A), (E = E1 || (E1 = {}))[E.A = 0] = "A", E[E.B = 1] = "B", E[E.C = 2] = "C";
        var E, E1, C = function() {
            _class_call_check(this, C);
        };
    }
    return A.prototype.m = function() {
        (E = E1 || (E1 = {}))[E.A = 0] = "A", E[E.B = 1] = "B", E[E.C = 2] = "C";
        var E, E1, C = function() {
            _class_call_check(this, C);
        };
        return new C();
    }, _create_class(A, [
        {
            key: "p",
            get: function() {
                (E = E1 || (E1 = {}))[E.A = 0] = "A", E[E.B = 1] = "B", E[E.C = 2] = "C";
                var E, E1, C = function() {
                    _class_call_check(this, C);
                };
                return new C();
            }
        }
    ]), A;
}();
