import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
!function(E) {
    E[E.A = 0] = "A", E[E.B = 1] = "B", E[E.C = 2] = "C";
}(E || (E = {}));
var E, cond, C1 = function() {
    "use strict";
    _class_call_check(this, C1), this.x1 = 1, this.x2 = -123, this.x3 = 7, this.x4 = "abc", this.x5 = "", this.x6 = "abcdef", this.x7 = !0, this.x8 = E.A, this.c1 = 1, this.c2 = -123, this.c3 = 7, this.c4 = "abc", this.c5 = "", this.c6 = "abcdef", this.c7 = !0, this.c8 = E.A;
}, C2 = function() {
    "use strict";
    function C2() {
        _class_call_check(this, C2);
    }
    var _proto = C2.prototype;
    return _proto.foo = function() {
        return 0;
    }, _proto.bar = function() {
        return cond ? 0 : 1;
    }, C2;
}(), a = [
    1,
    2
];
g1(1), g2(1, 1), g2(1, 2), g3(1, "two"), g4(1), g5(1, 2), g6([
    1,
    2
]), g6(a), g7(a), g8(1, function(x) {
    return x;
}), g8(1, function(x) {
    return x + 1;
});
var aa = [
    0
];
aa = function(a, x) {
    var result = a.slice();
    return result.push(1), result;
}(aa, 1);
