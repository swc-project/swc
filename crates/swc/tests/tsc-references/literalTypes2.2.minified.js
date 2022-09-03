//// [literalTypes2.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
function f1() {
    arguments.length > 0 && void 0 !== arguments[0] && arguments[0], arguments.length > 1 && void 0 !== arguments[1] && arguments[1], arguments.length > 2 && void 0 !== arguments[2] && arguments[2], arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : E.A, E.A, E.A, E.A;
}
function f2() {
    arguments.length > 0 && void 0 !== arguments[0] && arguments[0], arguments.length > 1 && void 0 !== arguments[1] && arguments[1], arguments.length > 2 && void 0 !== arguments[2] && arguments[2], arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : E.A, E.A, E.A;
}
function f3() {
    cond && E.A;
}
!function(E) {
    E[E.A = 0] = "A", E[E.B = 1] = "B", E[E.C = 2] = "C";
}(E || (E = {}));
var E, cond, C1 = function C1() {
    "use strict";
    _class_call_check(this, C1), this.x1 = 1, this.x2 = -123, this.x3 = 7, this.x4 = "abc", this.x5 = "", this.x6 = "abcdef", this.x7 = !0, this.x8 = E.A, this.c1 = 1, this.c2 = -123, this.c3 = 7, this.c4 = "abc", this.c5 = "", this.c6 = "abcdef", this.c7 = !0, this.c8 = E.A;
};
function f4() {}
function f5() {}
function f6() {
    var ref = {
        c1: !1,
        c2: 1,
        c3: "bar"
    };
    ref.c1, ref.c2, ref.c3;
    var ref1 = {
        x1: !1,
        x2: 1,
        x3: "bar"
    };
    ref1.x1, ref1.x2, ref1.x3;
}
function f10() {
    return "hello";
}
function f11() {
    return cond ? 1 : "two";
}
function f12() {
    return cond ? 1 : "two";
}
var C2 = function() {
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
}();
function f20() {}
var a = [
    1,
    2
], x1 = g1(1), x2 = g2(1, 1), x3 = g2(1, 2), x4 = g3(1, "two"), x5 = g4(1), x6 = g5(1, 2), x7 = g6([
    1,
    2
]), x8 = g6(a), x9 = g7(a), x10 = g8(1, function(x) {
    return x;
}), x11 = g8(1, function(x) {
    return x + 1;
});
function makeArray(x) {
    return [
        x
    ];
}
function append(a, x) {
    var result = a.slice();
    return result.push(x), result;
}
var aa = makeArray(0);
aa = append(aa, 1);
