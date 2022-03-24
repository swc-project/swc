class Base {
    b(a) {}
    get c() {
        return x;
    }
    set c(v) {}
    static s(a) {}
    static get t() {
        return x;
    }
    static set t(v) {}
    constructor(a){}
}
class Derived extends Base {
    b(a) {}
    get c() {
        return y;
    }
    set c(v) {}
    static s(a) {}
    static get t() {
        return y;
    }
    static set t(a) {}
    constructor(a){
        super(x);
    }
}
var x, y, d2, d = new Derived(y);
d.a, d.b(y), d.c, d.d, d.c = y, Derived.r, Derived.s(y), Derived.t, Derived.u, Derived.t = y, d2[''], d2[1];
