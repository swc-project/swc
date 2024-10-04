//// [genericCallWithGenericSignatureArguments2.ts]
// When a function expression is inferentially typed (section 4.9.3) and a type assigned to a parameter in that expression references type parameters for which inferences are being made, 
// the corresponding inferred type arguments to become fixed and no further candidate inferences are made for them.
(function(onlyT) {
    function foo(a, b) {
        var r;
        return r;
    }
    var r1 = foo(function(x) {
        return 1;
    }, function(x) {
        return '';
    });
    function other2(x) {
        var r7 = foo(function(a) {
            return a;
        }, function(b) {
            return b;
        }); // T => T
        // BUG 835518
        var r9 = r7(new Date()); // should be ok
        var r10 = r7(1); // error
    }
    function foo2(a, b) {
        var r;
        return r;
    }
    function other3(x) {
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
    }
    var E = /*#__PURE__*/ function(E) {
        E[E["A"] = 0] = "A";
        return E;
    }({});
    var F = /*#__PURE__*/ function(F) {
        F[F["A"] = 0] = "A";
        return F;
    }({});
    function foo3(x, a, b) {
        var r;
        return r;
    }
    var r7 = foo3(0, function(x) {
        return 0;
    }, function(x) {
        return 0;
    }); // error
})(onlyT || (onlyT = {}));
(function(TU) {
    function foo(a, b) {
        var r;
        return r;
    }
    var r1 = foo(function(x) {
        return 1;
    }, function(x) {
        return '';
    });
    function other2(x) {
        var r7 = foo(function(a) {
            return a;
        }, function(b) {
            return b;
        });
        var r9 = r7(new Date());
        var r10 = r7(1);
    }
    function foo2(a, b) {
        var r;
        return r;
    }
    function other3(x) {
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
    }
    var E = /*#__PURE__*/ function(E) {
        E[E["A"] = 0] = "A";
        return E;
    }({});
    var F = /*#__PURE__*/ function(F) {
        F[F["A"] = 0] = "A";
        return F;
    }({});
    function foo3(x, a, b) {
        var r;
        return r;
    }
    var r7 = foo3(0, function(x) {
        return 0;
    }, function(x) {
        return 0;
    });
})(TU || (TU = {}));
var onlyT, TU;
