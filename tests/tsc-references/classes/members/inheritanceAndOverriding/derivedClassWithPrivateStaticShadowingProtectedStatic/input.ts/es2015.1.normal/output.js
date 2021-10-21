// @target: ES5
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
