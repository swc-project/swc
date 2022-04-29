function foo(x) {
    return x(null);
}
foo(function(x) {
    return "";
}), foo(function(x) {
    return "";
}), foo(function(x) {
    return "";
}), function(x, cb) {
    cb(1);
}(1, function(a) {
    return "";
}), function(x, cb) {
    cb(1);
}(1, function(a) {
    return "";
}), function(x, cb) {
    cb("");
}("", function(a) {
    return 1;
}), function(x, cb, y) {
    cb(1);
}(1, function(a) {
    return "";
}, ""), function(x, cb, y) {
    cb(1);
}(1, function(a) {
    return "";
}, 1), function(x, cb, y) {
    cb(1);
}(1, function(a) {
    return "";
}, "");
