// Basic type inference with generic calls and constraints, no errors expected
class Base {
}
class Derived extends Base {
}
class Derived2 extends Derived {
}
var b;
var d1;
var d2;
function foo(t) {
    return t;
}
var r = foo(b); // Base
var r2 = foo(d1); // Derived
function foo2(t, u) {
    return u;
}
function foo2b(u) {
    var x;
    return x;
}
function foo2c() {
    var x;
    return x;
}
var r3 = foo2b(d1); // Base
var r3b = foo2c(); // Base
class C {
    foo(t, u) {
        return t;
    }
    foo2(t1, u1) {
        return u1;
    }
    foo3(t2, u2) {
        return t2;
    }
    foo4(t3, u3) {
        return t3;
    }
    foo5(t4, u4) {
        return t4;
    }
    foo6() {
        var x;
        return x;
    }
    foo7(u5) {
        var x;
        return x;
    }
    foo8() {
        var x;
        return x;
    }
    constructor(t5, u6){
        this.t = t5;
        this.u = u6;
    }
}
var c = new C(b, d1);
var r4 = c.foo(d1, d2); // Base
var r5 = c.foo2(b, d2); // Derived
var r6 = c.foo3(d1, d1); // Derived
var r7 = c.foo4(d1, d2); // Base
var r8 = c.foo5(d1, d2); // Derived
var r8b = c.foo5(d2, d2); // Derived2
var r9 = c.foo6(); // Derived
var r10 = c.foo7(d1); // Base
var r11 = c.foo8(); // Base
var i;
var r4 = i.foo(d1, d2); // Base
var r5 = i.foo2(b, d2); // Derived
var r6 = i.foo3(d1, d1); // Derived
var r7 = i.foo4(d1, d2); // Base
var r8 = i.foo5(d1, d2); // Derived
var r8b = i.foo5(d2, d2); // Derived2
var r9 = i.foo6(); // Derived
var r10 = i.foo7(d1); // Base
var r11 = i.foo8(); // Base
