function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
// should replace all refs to 'x' in the body,
// with fully qualified
var A1;
(function(A) {
    var lt12 = function lt12() {
        return x < 12;
    };
    A.x = 12;
})(A1 || (A1 = {
}));
// should not fully qualify 'x'
var B;
(function(B) {
    var lt12 = function lt12() {
        return x < 12;
    };
    var x = 12;
})(B || (B = {
}));
(function(C) {
    var no = function no() {
        return false;
    };
})(C || (C = {
}));
// copies, since exported
var D1;
(function(D) {
    var yes = function yes() {
        return true;
    };
    D.yes = yes;
})(D1 || (D1 = {
}));
// validate all exportable statements
var E1;
(function(E) {
    var fn = function fn() {
    };
    var Color1;
    (function(Color) {
        Color[Color["Red"] = 0] = "Red";
    })(Color1 || (Color1 = {
    }));
    E.fn = fn;
    var C = function C() {
        "use strict";
        _classCallCheck(this, C);
    };
    E.C = C;
    var M1;
    (function(M) {
        M.x = 42;
    })(M1 || (M1 = {
    }));
    E.Color = Color1, E.M = M1;
})(E1 || (E1 = {
}));
// validate all exportable statements,
// which are not exported
var F;
(function(F) {
    var fn = function fn() {
    };
    (function(Color) {
        Color[Color["Red"] = 0] = "Red";
    })(Color || (Color = {
    }));
    var C = function C() {
        "use strict";
        _classCallCheck(this, C);
    };
    (function(M) {
        var x = 42;
    })(M || (M = {
    }));
})(F || (F = {
}));
