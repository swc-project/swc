function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
!function(E) {
    E[E.A = 0] = "A", E[E.B = 1] = "B", E[E.C = 2] = "C";
}(E || (E = {}));
var E, cond, C1 = function() {
    "use strict";
    _classCallCheck(this, C1), this.x1 = 1, this.x2 = -123, this.x3 = 7, this.x4 = "abc", this.x5 = "", this.x6 = "abcdef", this.x7 = !0, this.x8 = E.A, this.c1 = 1, this.c2 = -123, this.c3 = 7, this.c4 = "abc", this.c5 = "", this.c6 = "abcdef", this.c7 = !0, this.c8 = E.A;
}, C2 = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function C2() {
        _classCallCheck(this, C2);
    }
    return Constructor = C2, protoProps = [
        {
            key: "foo",
            value: function() {
                return 0;
            }
        },
        {
            key: "bar",
            value: function() {
                return cond ? 0 : 1;
            }
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), C2;
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
aa = (function(a1, x) {
    var result = a1.slice();
    return result.push(1), result;
})(aa, 1);
