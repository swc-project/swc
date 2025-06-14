function f() {
    var g;
    g();
    throw Error("foo");
}
f();
