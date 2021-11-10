class Base {
    static fn() {
        return '';
    }
    static get a() {
        return 1;
    }
    static set a(v) {
    }
}
// BUG 847404
// should be error
class Derived extends Base {
    static fn() {
        return '';
    }
    static get a() {
        return 1;
    }
    static set a(v1) {
    }
}
var r = Base.x; // ok
var r2 = Derived.x; // error
var r3 = Base.fn(); // ok
var r4 = Derived.fn(); // error
var r5 = Base.a; // ok
Base.a = 2; // ok
var r6 = Derived.a; // error
Derived.a = 2; // error
