// checking whether other types are subtypes of type parameters with constraints
class Foo {
}
function f(t, u, v) {
    // ok
    var r1 = true ? t : u;
    var r1 = true ? u : t;
    // ok
    var r2 = true ? t : v;
    var r2 = true ? v : t;
    // ok
    var r3 = true ? v : u;
    var r3 = true ? u : v;
    // ok
    var r4 = true ? t : new Foo();
    var r4 = true ? new Foo() : t;
    // ok
    var r5 = true ? u : new Foo();
    var r5 = true ? new Foo() : u;
    // ok
    var r6 = true ? v : new Foo();
    var r6 = true ? new Foo() : v;
    // ok
    var r7 = true ? t : new Foo();
    var r7 = true ? new Foo() : t;
    // ok
    var r8 = true ? u : new Foo();
    var r8 = true ? new Foo() : u;
    // ok
    var r9 = true ? v : new Foo();
    var r9 = true ? new Foo() : v;
    // ok
    var r10 = true ? t : new Foo();
    var r10 = true ? new Foo() : t;
    // ok
    var r11 = true ? u : new Foo();
    var r11 = true ? new Foo() : u;
    // ok
    var r12 = true ? v : new Foo();
    var r12 = true ? new Foo() : v;
}
var M1;
(function(M1) {
    class Base {
    }
    class D1 extends Base {
    }
    class D2 extends Base {
    }
    class D3 extends Base {
    }
    class D4 extends Base {
    }
    class D5 extends Base {
    }
    class D6 extends Base {
    }
    class D7 extends Base {
    }
    class D8 extends Base {
    }
    class D9 extends Base {
    }
})(M1 || (M1 = {
}));
var M2;
(function(M2) {
    class Base2 {
    }
    class D1 extends Base2 {
    }
    class D2 extends Base2 {
    }
    class D3 extends Base2 {
    }
    class D4 extends Base2 {
    }
    class D5 extends Base2 {
    }
    class D6 extends Base2 {
    }
    class D7 extends Base2 {
    }
    class D8 extends Base2 {
    }
    class D9 extends Base2 {
    }
})(M2 || (M2 = {
}));
