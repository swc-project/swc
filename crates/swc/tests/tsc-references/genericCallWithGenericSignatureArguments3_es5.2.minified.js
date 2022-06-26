var E, F, x;
function foo(x, a, b) {}
function foo2(x, a, b) {}
foo("", function(x) {
    return "";
}, function(x) {
    return null;
}), foo("", function(x) {
    return "";
}, function(x) {
    return null;
}), foo("", function(x) {
    return "";
}, function(x) {
    return "";
}), foo(null, function(x) {
    return "";
}, function(x) {
    return "";
}), foo(null, function(x) {
    return "";
}, function(x) {
    return "";
}), foo({}, function(x) {
    return "";
}, function(x) {
    return "";
}), function(E) {
    E[E.A = 0] = "A";
}(E || (E = {})), function(F) {
    F[F.A = 0] = "A";
}(F || (F = {})), foo(E.A, function(x) {
    return E.A;
}, function(x) {
    return F.A;
}), foo2("", function(x) {
    return "";
}, function(x) {
    return null;
}), foo2(null, function(x) {
    return "";
}, function(x) {
    return "";
}), foo2(null, function(x) {
    return "";
}, function(x) {
    return "";
}), foo2(x, function(a1) {
    return function(n) {
        return 1;
    };
}, function(a2) {
    return 2;
}), foo2(x, function(a1) {
    return function(n) {
        return 1;
    };
}, function(a2) {
    return 2;
});
