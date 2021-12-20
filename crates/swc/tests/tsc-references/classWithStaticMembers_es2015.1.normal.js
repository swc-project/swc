class C {
    static fn() {
        return this;
    }
    static get x() {
        return 1;
    }
    static set x(v) {
    }
    constructor(a, b){
        this.a = a;
        this.b = b;
    }
}
var r = C.fn();
var r2 = r.x;
var r3 = r.foo;
class D extends C {
}
var r = D.fn();
var r2 = r.x;
var r3 = r.foo;
