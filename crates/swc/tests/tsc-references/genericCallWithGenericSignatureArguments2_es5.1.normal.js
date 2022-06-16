// When a function expression is inferentially typed (section 4.9.3) and a type assigned to a parameter in that expression references type parameters for which inferences are being made, 
// the corresponding inferred type arguments to become fixed and no further candidate inferences are made for them.
var onlyT;
(function(onlyT) {
    var foo = function foo(a, b) {
        var r;
        return r;
    };
    var other2 = function other2(x) {
        var r7 = foo(function(a) {
            return a;
        }, function(b) {
            return b;
        }); // T => T
        // BUG 835518
        var r9 = r7(new Date()); // should be ok
        var r10 = r7(1); // error
    };
    var foo2 = function foo2(a, b) {
        var r;
        return r;
    };
    var other3 = function other3(x) {
        var r7 = foo2(function(a) {
            return a;
        }, function(b) {
            return b;
        }); // error
        var r7b = foo2(function(a) {
            return a;
        }, function(b) {
            return b;
        }); // valid, T is inferred to be Date
    };
    var foo3 = function foo3(x, a, b) {
        var r;
        return r;
    };
    var r1 = foo(function(x) {
        return 1;
    }, function(x) {
        return "";
    });
    var E;
    (function(E) {
        E[E["A"] = 0] = "A";
    })(E || (E = {}));
    var F;
    (function(F) {
        F[F["A"] = 0] = "A";
    })(F || (F = {}));
    var r7 = foo3(E.A, function(x) {
        return E.A;
    }, function(x) {
        return F.A;
    }); // error
})(onlyT || (onlyT = {}));
var TU;
(function(TU) {
    var foo = function foo(a, b) {
        var r;
        return r;
    };
    var other2 = function other2(x) {
        var r7 = foo(function(a) {
            return a;
        }, function(b) {
            return b;
        });
        var r9 = r7(new Date());
        var r10 = r7(1);
    };
    var foo2 = function foo2(a, b) {
        var r;
        return r;
    };
    var other3 = function other3(x) {
        var r7 = foo2(function(a) {
            return a;
        }, function(b) {
            return b;
        });
        var r7b = foo2(function(a) {
            return a;
        }, function(b) {
            return b;
        });
    };
    var foo3 = function foo3(x, a, b) {
        var r;
        return r;
    };
    var r1 = foo(function(x) {
        return 1;
    }, function(x) {
        return "";
    });
    var E;
    (function(E) {
        E[E["A"] = 0] = "A";
    })(E || (E = {}));
    var F;
    (function(F) {
        F[F["A"] = 0] = "A";
    })(F || (F = {}));
    var r7 = foo3(E.A, function(x) {
        return E.A;
    }, function(x) {
        return F.A;
    });
})(TU || (TU = {}));
