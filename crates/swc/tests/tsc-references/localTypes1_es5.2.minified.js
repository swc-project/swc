import * as swcHelpers from "@swc/helpers";
var A = function() {
    function A() {
        swcHelpers.classCallCheck(this, A), (E = E1 || (E1 = {}))[E.A = 0] = "A", E[E.B = 1] = "B", E[E.C = 2] = "C";
        var E, E1, C = function() {
            swcHelpers.classCallCheck(this, C);
        };
    }
    return A.prototype.m = function() {
        (E = E2 || (E2 = {}))[E.A = 0] = "A", E[E.B = 1] = "B", E[E.C = 2] = "C";
        var E, E2, C = function() {
            swcHelpers.classCallCheck(this, C);
        };
        return new C();
    }, swcHelpers.createClass(A, [
        {
            key: "p",
            get: function() {
                (E = E3 || (E3 = {}))[E.A = 0] = "A", E[E.B = 1] = "B", E[E.C = 2] = "C";
                var E, E3, C = function() {
                    swcHelpers.classCallCheck(this, C);
                };
                return new C();
            }
        }
    ]), A;
}();
