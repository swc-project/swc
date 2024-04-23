//// [nameCollision.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var A;
(function(A) {
    // these 2 statements force an underscore before the 'A' 
    // in the generated function call.
    var A1 = 12;
    var _A = '';
})(A || (A = {}));
var B;
(function(B) {
    var A = 12;
})(B || (B = {}));
(function(B) {
    // re-opened module with colliding name
    // this should add an underscore.
    var B1 = function B() {
        "use strict";
        _class_call_check(this, B);
    };
})(B || (B = {}));
var X;
(function(X) {
    var X1 = 13;
    var Y;
    (function(Y) {
        var Y1 = 13;
        var Z;
        (function(Z) {
            var X = 12;
            var Y = 12;
            var Z1 = 12;
        })(Z = Y.Z || (Y.Z = {}));
    })(Y = X.Y || (X.Y = {}));
})(X || (X = {}));
var Y;
(function(Y) {
    (function(Y) {
        var Y;
        (function(Y) {
            Y[Y["Red"] = 0] = "Red";
            Y[Y["Blue"] = 1] = "Blue";
        })(Y = Y.Y || (Y.Y = {}));
    })(Y.Y || (Y.Y = {}));
})(Y || (Y = {}));
var D;
// no collision, since interface doesn't
// generate code.
(function(D) {
    D.E = 'hello';
})(D || (D = {}));
