class Base {
    b(a5) {
    }
    get c() {
        return x;
    }
    set c(v) {
    }
    static s(a1) {
    }
    static get t() {
        return x;
    }
    static set t(v1) {
    }
    constructor(a){
    }
}
class Derived extends Base {
    b(a2) {
    }
    get c() {
        return y;
    }
    set c(v2) {
    }
    static s(a3) {
    }
    static get t() {
        return y;
    }
    static set t(a4) {
    }
    constructor(a){
        super(a);
    }
}
var x, y, d2, d = new Derived(y);
d.a, d.b(y), d.c, d.d, d.c = y, Derived.s(y), Derived.t = y, d2[""], d2[1];
