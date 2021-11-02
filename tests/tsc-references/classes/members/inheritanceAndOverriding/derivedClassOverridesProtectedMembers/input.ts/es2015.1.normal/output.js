// @target: ES5
var x;
var y;
class Base {
    b(a) {
    }
    get c() {
        return x;
    }
    set c(v) {
    }
    static s(a1) {
    }
    static get t() {
        return x;
    }
    static set t(v1) {
    }
    constructor(a2){
    }
}
class Derived extends Base {
    b(a3) {
    }
    get c() {
        return y;
    }
    set c(v2) {
    }
    static s(a4) {
    }
    static get t() {
        return y;
    }
    static set t(a5) {
    }
    constructor(a6){
        super(x);
    }
}
