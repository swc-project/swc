// @target: ES5
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
