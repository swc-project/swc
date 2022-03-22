var i, c = new class {
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
}('', 1);
c.foo('', 1), c.foo2('', 1), c.foo3(!0, 1), c.foo4('', !0), c.foo5(!0, 1), c.foo6(), c.foo7(''), c.foo8(), i.foo('', 1), i.foo2('', 1), i.foo3(!0, 1), i.foo4('', !0), i.foo5(!0, 1), i.foo6(), i.foo7(''), i.foo8();
