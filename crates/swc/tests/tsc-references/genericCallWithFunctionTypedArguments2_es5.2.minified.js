var i, i2, a;
function foo(x) {
    return new x(null);
}
function foo2(x, cb) {
    return new cb(x);
}
foo(i), foo(i), foo(i2), foo(a), foo2(1, i2), foo2(1, a), foo2(1, i), foo2("", i2), new i(null), new a(null), new i2(1), new i2("");
