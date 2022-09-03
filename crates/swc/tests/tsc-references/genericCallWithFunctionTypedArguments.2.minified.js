//// [genericCallWithFunctionTypedArguments.ts]
function foo(x) {
    return x(null);
}
var r = foo(function(x) {
    return "";
}), r2 = foo(function(x) {
    return "";
}), r3 = foo(function(x) {
    return "";
});
function foo2(x, cb) {
    return cb(x);
}
var r4 = foo2(1, function(a) {
    return "";
}), r5 = foo2(1, function(a) {
    return "";
}), r6 = foo2("", function(a) {
    return 1;
});
function foo3(x, cb, y) {
    return cb(x);
}
var r7 = foo3(1, function(a) {
    return "";
}, ""), r8 = foo3(1, function(a) {
    return "";
}, 1), r9 = foo3(1, function(a) {
    return "";
}, "");
function other(t, u) {
    foo2(1, function(x) {
        return "";
    }), foo2(1, function(x) {
        return "";
    }), foo3(1, function(x) {
        return "";
    }, ""), foo3(1, function(x) {
        return "";
    }, 1), foo3(1, function(a) {
        return "";
    }, 1);
}
