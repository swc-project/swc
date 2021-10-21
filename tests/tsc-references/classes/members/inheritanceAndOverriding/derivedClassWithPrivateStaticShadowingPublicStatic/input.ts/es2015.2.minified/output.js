class Base {
    static fn() {
        return "";
    }
    static get a() {
        return 1;
    }
    static set a(v) {
    }
}
class Derived extends Base {
    static fn() {
        return "";
    }
    static get a() {
        return 1;
    }
    static set a(v1) {
    }
}
Base.fn(), Derived.fn(), Base.a = 2, Derived.a = 2;
