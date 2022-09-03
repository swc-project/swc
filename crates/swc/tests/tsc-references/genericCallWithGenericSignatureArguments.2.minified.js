//// [genericCallWithGenericSignatureArguments.ts]
function foo(a, b) {}
var a, b, r1b = foo(function(x) {
    return 1;
}, function(x) {
    return "";
}), r2 = foo(function(x) {
    return null;
}, function(x) {
    return "";
}), r3 = foo(function(x) {
    return 1;
}, function(x) {
    return null;
}), r3ii = foo(function(x) {
    return 1;
}, function(x) {
    return 1;
}), r4 = foo(function(x) {
    return a;
}, function(x) {
    return b;
}), r5 = foo(function(x) {
    return b;
}, function(x) {
    return a;
});
function other(x) {
    foo(function(a) {
        return a;
    }, function(b) {
        return b;
    }), foo(function(a) {
        return a;
    }, function(b) {
        return b;
    });
}
function other2(x) {
    var r7 = foo(function(a) {
        return a;
    }, function(b) {
        return b;
    });
    foo(function(a) {
        return a;
    }, function(b) {
        return b;
    }), r7(null);
}
function foo2(a, b) {}
function other3(x) {
    foo2(function(a) {
        return a;
    }, function(b) {
        return b;
    });
}
