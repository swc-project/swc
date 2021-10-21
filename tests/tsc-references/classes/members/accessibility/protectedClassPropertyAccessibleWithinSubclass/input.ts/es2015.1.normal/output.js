// @target: ES5
// no errors
class B {
}
class C extends B {
    get y() {
        return this.x;
    }
    set y(x) {
        this.y = this.x;
    }
    foo() {
        return this.x;
    }
    bar() {
        return this.foo();
    }
    static get y() {
        return this.x;
    }
    static set y(x1) {
        this.y = this.x;
    }
    static foo() {
        return this.x;
    }
    static bar() {
        this.foo();
    }
}
