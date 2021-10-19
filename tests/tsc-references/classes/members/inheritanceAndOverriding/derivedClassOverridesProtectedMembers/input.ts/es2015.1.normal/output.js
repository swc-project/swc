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
    static s(a) {
    }
    static get t() {
        return x;
    }
    static set t(v) {
    }
    constructor(a){
    }
}
class Derived extends Base {
    b(a) {
    }
    get c() {
        return y;
    }
    set c(v) {
    }
    static s(a) {
    }
    static get t() {
        return y;
    }
    static set t(a) {
    }
    constructor(a){
        super(x);
    }
}
