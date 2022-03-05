import * as swcHelpers from "@swc/helpers";
var A = function() {
    "use strict";
    function A() {
        swcHelpers.classCallCheck(this, A), (E = E || (E = {}))[E.A = 0] = "A", E[E.B = 1] = "B", E[E.C = 2] = "C";
        var E, E, C = function() {
            swcHelpers.classCallCheck(this, C);
        };
    }
    return swcHelpers.createClass(A, [
        {
            key: "m",
            value: function() {
                (E = E || (E = {}))[E.A = 0] = "A", E[E.B = 1] = "B", E[E.C = 2] = "C";
                var E, E, C = function() {
                    swcHelpers.classCallCheck(this, C);
                };
                return new C();
            }
        },
        {
            key: "p",
            get: function() {
                (E = E || (E = {}))[E.A = 0] = "A", E[E.B = 1] = "B", E[E.C = 2] = "C";
                var E, E, C = function() {
                    swcHelpers.classCallCheck(this, C);
                };
                return new C();
            }
        }
    ]), A;
}();
