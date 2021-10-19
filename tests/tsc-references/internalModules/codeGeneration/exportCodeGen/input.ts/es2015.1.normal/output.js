// should replace all refs to 'x' in the body,
// with fully qualified
var A;
(function(A) {
    A.x = 12;
    function lt12() {
        return x < 12;
    }
})(A || (A = {
}));
// should not fully qualify 'x'
var B;
(function(B) {
    var x = 12;
    function lt12() {
        return x < 12;
    }
})(B || (B = {
}));
(function(C) {
    function no() {
        return false;
    }
})(C || (C = {
}));
// copies, since exported
var D;
(function(D) {
    function yes() {
        return true;
    }
    D.yes = yes;
})(D || (D = {
}));
// validate all exportable statements
var E;
(function(E) {
    var Color;
    (function(Color) {
        Color[Color["Red"] = 0] = "Red";
    })(Color || (Color = {
    }));
    function fn() {
    }
    E.fn = fn;
    class C {
    }
    E.C = C;
    var M;
    (function(M) {
        M.x = 42;
    })(M || (M = {
    }));
    E.Color = Color, E.M = M;
})(E || (E = {
}));
// validate all exportable statements,
// which are not exported
var F;
(function(F) {
    (function(Color) {
        Color[Color["Red"] = 0] = "Red";
    })(Color || (Color = {
    }));
    function fn() {
    }
    class C {
    }
    (function(M) {
        var x = 42;
    })(M || (M = {
    }));
})(F || (F = {
}));
