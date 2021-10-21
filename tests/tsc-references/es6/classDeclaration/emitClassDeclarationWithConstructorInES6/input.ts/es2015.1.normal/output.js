// @target: es6
class A {
    foo() {
    }
    constructor(x){
    }
}
class B {
    baz(z, v) {
        return this._bar;
    }
    constructor(x1, z1 = "hello", ...args){
        this.x = "hello";
        this.y = 10;
    }
}
