import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var A = function() {
    "use strict";
    function A() {
        _class_call_check(this, A), (E = E1 || (E1 = {}))[E.A = 0] = "A", E[E.B = 1] = "B", E[E.C = 2] = "C";
        var E, E1, C = function() {
            _class_call_check(this, C);
        };
    }
    return A.prototype.m = function() {
        (E = E2 || (E2 = {}))[E.A = 0] = "A", E[E.B = 1] = "B", E[E.C = 2] = "C";
        var E, E2, C = function() {
            _class_call_check(this, C);
        };
        return new C();
    }, _create_class(A, [
        {
            key: "p",
            get: function() {
                (E = E3 || (E3 = {}))[E.A = 0] = "A", E[E.B = 1] = "B", E[E.C = 2] = "C";
                var E, E3, C = function() {
                    _class_call_check(this, C);
                };
                return new C();
            }
        }
    ]), A;
}();
