//// [genericCallWithGenericSignatureArguments3.ts]
function foo(x, a, b) {}
var E, F, x, r1 = foo("", function(x) {
    return "";
}, function(x) {
    return null;
}), r1ii = foo("", function(x) {
    return "";
}, function(x) {
    return null;
}), r2 = foo("", function(x) {
    return "";
}, function(x) {
    return "";
}), r3 = foo(null, function(x) {
    return "";
}, function(x) {
    return "";
}), r4 = foo(null, function(x) {
    return "";
}, function(x) {
    return "";
}), r5 = foo({}, function(x) {
    return "";
}, function(x) {
    return "";
});
!function(E) {
    E[E.A = 0] = "A";
}(E || (E = {})), function(F) {
    F[F.A = 0] = "A";
}(F || (F = {}));
var r6 = foo(E.A, function(x) {
    return E.A;
}, function(x) {
    return F.A;
});
function foo2(x, a, b) {}
var r8 = foo2("", function(x) {
    return "";
}, function(x) {
    return null;
}), r9 = foo2(null, function(x) {
    return "";
}, function(x) {
    return "";
}), r10 = foo2(null, function(x) {
    return "";
}, function(x) {
    return "";
}), r11 = foo2(x, function(a1) {
    return function(n) {
        return 1;
    };
}, function(a2) {
    return 2;
}), r12 = foo2(x, function(a1) {
    return function(n) {
        return 1;
    };
}, function(a2) {
    return 2;
});
