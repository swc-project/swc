// subclassing is not transitive when you can remove required parameters and add optional parameters
class C {
    foo(x, y) {
    }
}
class D extends C {
    foo(x1) {
    }
}
class E extends D {
    foo(x2, y1) {
    }
}
var c;
var d;
var e;
c = e;
var r = c.foo('', '');
var r2 = e.foo('', 1);
