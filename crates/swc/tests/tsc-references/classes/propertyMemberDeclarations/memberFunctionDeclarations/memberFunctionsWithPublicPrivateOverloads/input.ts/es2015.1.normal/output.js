class C {
    foo(x, y) {
    }
    bar(x1, y1) {
    }
    static foo(x2, y2) {
    }
    baz(x3, y3) {
    }
    static bar(x4, y4) {
    }
    static baz(x5, y5) {
    }
}
class D {
    foo(x6, y6) {
    }
    bar(x7, y7) {
    }
    baz(x8, y8) {
    }
    static foo(x9, y9) {
    }
    static bar(x10, y10) {
    }
    static baz(x11, y11) {
    }
}
var c;
var r = c.foo(1); // error
var d;
var r2 = d.foo(2); // error
