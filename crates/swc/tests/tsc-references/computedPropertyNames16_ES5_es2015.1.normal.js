// @target: es5
var s;
var n;
var a;
class C {
    get [s]() {
        return 0;
    }
    set [n](v) {}
    static get [s + s]() {
        return 0;
    }
    set [s + n](v) {}
    get [+s]() {
        return 0;
    }
    static set [""](v) {}
    get [0]() {
        return 0;
    }
    set [a](v) {}
    static get [true]() {
        return 0;
    }
    set [`hello bye`](v) {}
    get [`hello ${a} bye`]() {
        return 0;
    }
}
