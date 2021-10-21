function foo(t) {
    return t;
}
foo(b), foo(d1);
var b, d1, d2, i, c = new class {
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
    }
    foo7(u5) {
    }
    foo8() {
    }
    constructor(t5, u6){
        this.t = t5, this.u = u6;
    }
}(b, d1);
c.foo(d1, d2), c.foo2(b, d2), c.foo3(d1, d1), c.foo4(d1, d2), c.foo5(d1, d2), c.foo5(d2, d2), c.foo6(), c.foo7(d1), c.foo8(), i.foo(d1, d2), i.foo2(b, d2), i.foo3(d1, d1), i.foo4(d1, d2), i.foo5(d1, d2), i.foo5(d2, d2), i.foo6(), i.foo7(d1), i.foo8();
