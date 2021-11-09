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
        this.a = a, this.b = b;
    }
}
var r = C.fn();
r.x, r.foo;
var r = (class extends C {
}).fn();
r.x, r.foo;
