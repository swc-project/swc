// @target: es5
var s;
var n;
var a;
let _s = s, _n = n, tmp = s + s, tmp1 = s + n, tmp2 = +s, _a = a, tmp3 = `hello ${a} bye`;
class C {
    get [_s]() {
        return 0;
    }
    set [_n](v) {}
    static get [tmp]() {
        return 0;
    }
    set [tmp1](v) {}
    get [tmp2]() {
        return 0;
    }
    static set [""](v) {}
    get [0]() {
        return 0;
    }
    set [_a](v) {}
    static get [true]() {
        return 0;
    }
    set [`hello bye`](v) {}
    get [tmp3]() {
        return 0;
    }
}
