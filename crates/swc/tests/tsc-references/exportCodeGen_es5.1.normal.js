import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// should replace all refs to 'x' in the body,
// with fully qualified
var A;
(function(A) {
    var lt12 = function lt12() {
        return x < 12;
    };
    var x = A.x = 12;
})(A || (A = {}));
// should not fully qualify 'x'
var B;
(function(B) {
    var lt12 = function lt12() {
        return x < 12;
    };
    var x = 12;
})(B || (B = {}));
// not copied, since not exported
var C;
(function(C) {
    var no = function no() {
        return false;
    };
})(C || (C = {}));
// copies, since exported
var D;
(function(D) {
    var yes = function yes() {
        return true;
    };
    D.yes = yes;
})(D || (D = {}));
// validate all exportable statements
var E;
(function(E) {
    var fn = function fn() {};
    var Color;
    (function(Color) {
        Color[Color["Red"] = 0] = "Red";
    })(Color = E.Color || (E.Color = {}));
    E.fn = fn;
    var C = function C() {
        "use strict";
        _class_call_check(this, C);
    };
    E.C = C;
    var M;
    (function(M) {
        var x = M.x = 42;
    })(M = E.M || (E.M = {}));
})(E || (E = {}));
// validate all exportable statements,
// which are not exported
var F;
(function(F) {
    var fn = function fn() {};
    var Color;
    (function(Color) {
        Color[Color["Red"] = 0] = "Red";
    })(Color || (Color = {}));
    var C = function C() {
        "use strict";
        _class_call_check(this, C);
    };
    var M;
    (function(M) {
        var x = 42;
    })(M || (M = {}));
})(F || (F = {}));
