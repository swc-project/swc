// should replace all refs to 'x' in the body,
// with fully qualified
var A;
(function(A) {
    var x = A.x = 12;
    function lt12() {
        return x < 12;
    }
})(A || (A = {}));
// should not fully qualify 'x'
var B;
(function(B) {
    var x = 12;
    function lt12() {
        return x < 12;
    }
})(B || (B = {}));
// not copied, since not exported
var C;
(function(C) {
    function no() {
        return false;
    }
})(C || (C = {}));
// copies, since exported
var D;
(function(D) {
    function yes() {
        return true;
    }
    D.yes = yes;
})(D || (D = {}));
// validate all exportable statements
var E;
(function(E) {
    let Color;
    (function(Color) {
        Color[Color["Red"] = 0] = "Red";
    })(Color = E.Color || (E.Color = {}));
    function fn() {}
    E.fn = fn;
    class C {
    }
    E.C = C;
    let M;
    (function(M) {
        var x = M.x = 42;
    })(M = E.M || (E.M = {}));
})(E || (E = {}));
// validate all exportable statements,
// which are not exported
var F;
(function(F) {
    let Color;
    (function(Color) {
        Color[Color["Red"] = 0] = "Red";
    })(Color || (Color = {}));
    function fn() {}
    class C {
    }
    let M;
    (function(M) {
        var x = 42;
    })(M || (M = {}));
})(F || (F = {}));
