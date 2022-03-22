class Base {
    static fn() {
        return '';
    }
    static get a() {
        return 1;
    }
    static set a(v) {}
}
class Derived extends Base {
    static fn() {
        return '';
    }
    static get a() {
        return 1;
    }
    static set a(v) {}
}
Base.x, Derived.x, Base.fn(), Derived.fn(), Base.a, Base.a = 2, Derived.a, Derived.a = 2;
