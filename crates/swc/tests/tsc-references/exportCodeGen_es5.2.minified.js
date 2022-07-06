var A, B, C, D, E, F;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
(A || (A = {})).x = 12, B || (B = {}), C || (C = {}), function(D) {
    var yes = function() {
        return !0;
    };
    D.yes = yes;
}(D || (D = {})), function(E) {
    var Color, fn = function() {};
    (Color = E.Color || (E.Color = {}))[Color.Red = 0] = "Red", E.fn = fn;
    var C = function() {
        "use strict";
        _class_call_check(this, C);
    };
    E.C = C, (E.M || (E.M = {})).x = 42;
}(E || (E = {})), function(F) {
    (Color1 = Color || (Color = {}))[Color1.Red = 0] = "Red";
    var Color, M, Color1, C = function() {
        "use strict";
        _class_call_check(this, C);
    };
    M || (M = {});
}(F || (F = {}));
