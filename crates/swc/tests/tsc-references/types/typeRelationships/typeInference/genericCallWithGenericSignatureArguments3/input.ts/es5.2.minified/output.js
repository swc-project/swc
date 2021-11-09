var E, F, x, E1, F1;
function foo(x, a, b) {
}
function foo2(x, a, b) {
}
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
}), foo(new Object(), function(x) {
    return "";
}, function(x) {
    return "";
}), (E1 = E || (E = {
}))[E1.A = 0] = "A", (F1 = F || (F = {
}))[F1.A = 0] = "A", foo(E.A, function(x) {
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
