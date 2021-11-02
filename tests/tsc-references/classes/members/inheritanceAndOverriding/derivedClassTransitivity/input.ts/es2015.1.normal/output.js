// subclassing is not transitive when you can remove required parameters and add optional parameters
class C {
    foo(x) {
    }
}
class D extends C {
    foo() {
    }
}
class E extends D {
    foo(x1) {
    }
}
var c;
var d;
var e;
c = e;
var r = c.foo(1);
var r2 = e.foo('');
