//// [typeFromPropertyAssignment36.ts]
function d() {}
((_$d = function() {}).e = 12, _$d.e, _$d.q = !1, // error d.q might not be assigned
_$d.q, _$d.q = !1, _$d.q, _$d.r = 1, _$d.r, _$d.s = "hi", _$d).s, d.e = 12, d.e, d.q, d.q = !0, d.q, d.r = 2, d.r;
// test function expressions too
var _$d, g = function() {};
g.expando // error
, g.both = 0, g.both;
