// @target: ES5
class C {
    get x() {
        return 1;
    }
    set x(v) {
    }
}
class D {
    get x() {
        return 1;
    }
    set x(v1) {
    }
}
class E {
    set x(v2) {
    }
    get x() {
        return 1;
    }
}
class F {
    static set x(v3) {
    }
    static get x() {
        return 1;
    }
}
