function f() {
    g();
    x = 10;
    throw new Error("foo");
    var x;
    var g;
}
f();
