import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var A;
(function(A1) {
    var B1;
    (function(B) {
        var x1;
        B.x = x1;
    })(B1 = A1.B || (A1.B = {}));
})(A || (A = {}));
(function(A) {
    var B2;
    (function(B) {
        var x2;
        B.x = x2;
    })(B2 || (B2 = {}));
})(A || (A = {}));
// ensure the right var decl is exported
var x;
var x = A.B.x;
var X;
(function(X1) {
    var Y1;
    (function(Y) {
        var Z1;
        (function(Z) {
            var Line = function Line() {
                "use strict";
                _class_call_check(this, Line);
            };
            Z.Line = Line;
        })(Z1 = Y.Z || (Y.Z = {}));
    })(Y1 = X1.Y || (X1.Y = {}));
})(X || (X = {}));
(function(X2) {
    var Y;
    (function(Y) {
        var Z2;
        (function(Z) {
            var Line = function Line() {
                "use strict";
                _class_call_check(this, Line);
            };
            Z.Line = Line;
        })(Z2 || (Z2 = {}));
    })(Y = X2.Y || (X2.Y = {}));
})(X || (X = {}));
// make sure merging works as expected
var l;
var l;
