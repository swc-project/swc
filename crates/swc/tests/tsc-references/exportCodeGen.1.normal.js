//// [exportCodeGen.ts]
// should replace all refs to 'x' in the body,
// with fully qualified
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
(function(A) {
    A.x = 12;
    function lt12() {
        return x < 12;
    }
})(A || (A = {}));
(function(B) {
    var x1 = 12;
    function lt12() {
        return x1 < 12;
    }
})(B || (B = {}));
(function(C) {
    function no() {
        return false;
    }
})(C || (C = {}));
(function(D) {
    function yes() {
        return true;
    }
    D.yes = yes;
})(D || (D = {}));
(function(E) {
    (function(Color) {
        Color[Color["Red"] = 0] = "Red";
    })(E.Color || (E.Color = {}));
    function fn() {}
    E.fn = fn;
    var C = function C() {
        "use strict";
        _class_call_check(this, C);
    };
    E.C = C;
    (function(M) {
        M.x = 42;
    })(E.M || (E.M = {}));
})(E || (E = {}));
(function(F) {
    var Color = /*#__PURE__*/ function(Color) {
        Color[Color["Red"] = 0] = "Red";
        return Color;
    }({});
    function fn() {}
    var C = function C() {
        "use strict";
        _class_call_check(this, C);
    };
    (function(M) {
        var x1 = 42;
    })(M || (M = {}));
    var M;
})(F || (F = {}));
var A, B, C, D, E, F;
