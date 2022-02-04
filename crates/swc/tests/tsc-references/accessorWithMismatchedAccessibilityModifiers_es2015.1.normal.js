// @target: ES5
class C {
    get x() {
        return 1;
    }
    set x(v) {}
}
class D {
    get x() {
        return 1;
    }
    set x(v) {}
}
class E {
    set x(v) {}
    get x() {
        return 1;
    }
}
class F {
    static set x(v) {}
    static get x() {
        return 1;
    }
}
