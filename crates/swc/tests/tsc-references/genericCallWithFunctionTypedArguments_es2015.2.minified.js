function foo(x) {
    return x(null);
}
function foo2(x, cb) {
    return cb(x);
}
function foo3(x, cb, y) {
    return cb(x);
}
foo((x)=>""
), foo((x)=>""
), foo((x)=>""
), foo2(1, function(a) {
    return "";
}), foo2(1, (a)=>""
), foo2("", (a)=>1
), foo3(1, (a)=>""
, ""), foo3(1, function(a) {
    return "";
}, 1), foo3(1, (a)=>""
, "");
