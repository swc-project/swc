// @target: es6
var s;
var n;
var a;
let _s = s, _n = n, tmp = s + s, tmp1 = s + n, tmp2 = +s, _a = a, tmp3 = `hello ${a} bye`;
class C {
    [_s]() {}
    [_n]() {}
    static [tmp]() {}
    [tmp1]() {}
    [tmp2]() {}
    static [""]() {}
    [0]() {}
    [_a]() {}
    static [true]() {}
    [`hello bye`]() {}
    static [tmp3]() {}
}
