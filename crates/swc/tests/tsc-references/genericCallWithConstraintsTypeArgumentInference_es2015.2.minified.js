var b, d1, d2, i, c = new class {
    foo(t, u) {
        return t;
    }
    foo2(t, u) {
        return u;
    }
    foo3(t, u) {
        return t;
    }
    foo4(t, u) {
        return t;
    }
    foo5(t, u) {
        return t;
    }
    foo6() {}
    foo7(u) {}
    foo8() {}
    constructor(t, u){
        this.t = t, this.u = u;
    }
}(b, d1);
c.foo(d1, d2), c.foo2(b, d2), c.foo3(d1, d1), c.foo4(d1, d2), c.foo5(d1, d2), c.foo5(d2, d2), c.foo6(), c.foo7(d1), c.foo8(), i.foo(d1, d2), i.foo2(b, d2), i.foo3(d1, d1), i.foo4(d1, d2), i.foo5(d1, d2), i.foo5(d2, d2), i.foo6(), i.foo7(d1), i.foo8();
