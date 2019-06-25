// subclassing is not transitive when you can remove required parameters and add optional parameters

class C {
    foo(x: number) { }
}

class D extends C {
    foo() { } // ok to drop parameters
}

class E extends D {
    foo(x?: string) { } // ok to add optional parameters
}

var c: C;
var d: D;
var e: E;
c = e;
var r = c.foo(1);
var r2 = e.foo('');