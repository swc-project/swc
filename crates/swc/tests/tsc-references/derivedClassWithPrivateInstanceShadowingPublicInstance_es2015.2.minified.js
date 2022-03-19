class Base {
    fn() {
        return '';
    }
    get a() {
        return 1;
    }
    set a(v) {}
}
class Derived extends Base {
    fn() {
        return '';
    }
    get a() {
        return 1;
    }
    set a(v) {}
}
Base.x, Derived.x, Base.fn(), Derived.fn(), Base.a, Base.a = 2, Derived.a, Derived.a = 2;
