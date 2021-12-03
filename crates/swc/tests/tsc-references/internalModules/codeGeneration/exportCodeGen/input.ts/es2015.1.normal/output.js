// should replace all refs to 'x' in the body,
// with fully qualified
var A;
(function(A1) {
    A1.x = 12;
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
(function(D1) {
    function yes() {
        return true;
    }
    D1.yes = yes;
})(D || (D = {
}));
// validate all exportable statements
var E;
(function(E1) {
    var Color1;
    (function(Color) {
        Color[Color["Red"] = 0] = "Red";
    })(Color1 || (Color1 = {
    }));
    function fn() {
    }
    E1.fn = fn;
    class C {
    }
    E1.C = C;
    var M1;
    (function(M) {
        M.x = 42;
    })(M1 || (M1 = {
    }));
    E1.Color = Color1, E1.M = M1;
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
