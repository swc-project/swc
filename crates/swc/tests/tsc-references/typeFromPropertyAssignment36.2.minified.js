//// [typeFromPropertyAssignment36.ts]
function f(b) {
    var _$d = function() {};
    return _$d.e = 12, _$d.e, b && (_$d.q = !1), _$d.q, b ? _$d.q = !1 : _$d.q = !0, _$d.q, b ? _$d.r = 1 : _$d.r = 2, _$d.r, b && (_$d.s = "hi"), _$d;
}
var test = f(!0).s;
function d() {}
d.e = 12, d.e, d.q, d.q = !0, d.q, d.r = 2, d.r;
var g = function() {};
g.expando, g.both = 0, g.both;
