class Base {
    fn() {
        return "";
    }
    get a() {
        return 1;
    }
    set a(v) {
    }
}
class Derived extends Base {
    fn() {
        return "";
    }
    get a() {
        return 1;
    }
    set a(v1) {
    }
}
Base.fn(), Derived.fn(), Base.a = 2, Derived.a = 2;
