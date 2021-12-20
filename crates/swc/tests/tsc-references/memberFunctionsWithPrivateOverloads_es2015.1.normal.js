class C {
    foo(x, y) {
    }
    bar(x, y) {
    }
    static foo(x, y) {
    }
    static bar(x, y) {
    }
}
class D {
    foo(x, y) {
    }
    bar(x, y) {
    }
    static foo(x, y) {
    }
    static bar(x, y) {
    }
}
var c;
var r = c.foo(1); // error
var d;
var r2 = d.foo(2); // error
var r3 = C.foo(1); // error
var r4 = D.bar(''); // error
