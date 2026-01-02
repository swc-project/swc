//// [nameCollision.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
(function(A) {
    // these 2 statements force an underscore before the 'A' 
    // in the generated function call.
    var A1 = 12;
    var _A = '';
})(A || (A = {}));
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
(function(X) {
    var X1 = 13;
    (function(Y) {
        var _$Y = 13;
        (function(Z) {
            var X = 12;
            var _$Y = 12;
            var Z1 = 12;
        })(Y.Z || (Y.Z = {}));
    })(X.Y || (X.Y = {}));
})(X || (X = {}));
(function(Y) {
    (function(Y) {
        (function(Y) {
            Y[Y["Red"] = 0] = "Red";
            Y[Y["Blue"] = 1] = "Blue";
        })(Y.Y || (Y.Y = {}));
    })(Y.Y || (Y.Y = {}));
})(Y || (Y = {}));
// no collision, since interface doesn't
// generate code.
(function(D) {
    D.E = 'hello';
})(D || (D = {}));
var A, B, X, Y, D;
