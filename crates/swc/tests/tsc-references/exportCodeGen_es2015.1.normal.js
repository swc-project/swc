// should replace all refs to 'x' in the body,
// with fully qualified
var A;
(function(A1) {
    var x = A1.x = 12;
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
(function(D1) {
    function yes() {
        return true;
    }
    D1.yes = yes;
})(D || (D = {}));
// validate all exportable statements
var E;
(function(E1) {
    let Color;
    (function(Color) {
        Color[Color["Red"] = 0] = "Red";
    })(Color = E1.Color || (E1.Color = {}));
    function fn() {}
    E1.fn = fn;
    class C1 {
    }
    E1.C = C1;
    let M1;
    (function(M) {
        var x = M.x = 42;
    })(M1 = E1.M || (E1.M = {}));
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
