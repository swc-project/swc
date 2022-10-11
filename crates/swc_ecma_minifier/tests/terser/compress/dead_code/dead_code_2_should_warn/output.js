function f() {
    var x, g, q, y;
    g();
    x = 10;
    throw Error("foo");
}
f();
