class Base {
    fn() {
        return '';
    }
    get a() {
        return 1;
    }
    set a(v) {
    }
}
// error, not a subtype
class Derived extends Base {
    fn() {
        return '';
    }
    get a() {
        return 1;
    }
    set a(v1) {
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
