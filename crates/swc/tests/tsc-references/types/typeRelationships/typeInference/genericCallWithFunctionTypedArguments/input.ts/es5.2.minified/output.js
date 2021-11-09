function foo(x) {
    return x(null);
}
function foo2(x, cb) {
    return cb(x);
}
function foo3(x, cb, y) {
    return cb(x);
}
foo(function(x) {
    return "";
}), foo(function(x) {
    return "";
}), foo(function(x) {
    return "";
}), foo2(1, function(a) {
    return "";
}), foo2(1, function(a) {
    return "";
}), foo2("", function(a) {
    return 1;
}), foo3(1, function(a) {
    return "";
}, ""), foo3(1, function(a) {
    return "";
}, 1), foo3(1, function(a) {
    return "";
}, "");
