class Base {
    b() {
    }
    get c() {
        return "";
    }
    set c(v) {
    }
    static s() {
    }
    static get t() {
        return "";
    }
    static set t(v1) {
    }
    constructor(x){
    }
}
class Derived extends Base {
}
var d2, d = new Derived(1);
d.a, d.b(), d.c, d.c = "", Derived.s(), Derived.t = "", d2[""], d2[1];
