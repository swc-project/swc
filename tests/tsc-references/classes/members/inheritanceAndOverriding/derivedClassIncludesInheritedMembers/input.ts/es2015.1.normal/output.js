class Base {
    b() {
    }
    get c() {
        return '';
    }
    set c(v) {
    }
    static s() {
    }
    static get t() {
        return '';
    }
    static set t(v1) {
    }
    constructor(x){
    }
}
class Derived extends Base {
}
var d = new Derived(1);
var r1 = d.a;
var r2 = d.b();
var r3 = d.c;
d.c = '';
var r4 = Derived.r;
var r5 = Derived.s();
var r6 = Derived.t;
Derived.t = '';
class Base2 {
}
class Derived2 extends Base2 {
}
var d2;
var r7 = d2[''];
var r8 = d2[1];
