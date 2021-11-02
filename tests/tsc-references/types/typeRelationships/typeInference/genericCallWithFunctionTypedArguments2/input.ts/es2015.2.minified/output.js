var i, i2, a;
function foo(x) {
    return new x(null);
}
function foo2(x, cb) {
    return new cb(x);
}
function foo3(x, cb, y) {
    return new cb(x);
}
foo(i), foo(i), foo(i2), foo(a), foo2(1, i2), foo2(1, a), foo2(1, i), foo2("", i2), foo3(null, i, ""), foo3(null, a, ""), foo3(1, i2, 1), foo3("", i2, "");
