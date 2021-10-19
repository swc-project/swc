class C {
    foo(x, y) {
    }
    bar(x, y) {
    }
    static foo(x, y) {
    }
    baz(x, y) {
    }
    static bar(x, y) {
    }
    static baz(x, y) {
    }
}
class D {
    foo(x, y) {
    }
    bar(x, y) {
    }
    baz(x, y) {
    }
    static foo(x, y) {
    }
    static bar(x, y) {
    }
    static baz(x, y) {
    }
}
var c;
var r = c.foo(1); // error
var d;
var r2 = d.foo(2); // error
