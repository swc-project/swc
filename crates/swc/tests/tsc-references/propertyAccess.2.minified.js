//// [propertyAccess.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var Compass, bothIndex, stringOrNumber, someObject, dd, ee, ff, gg, hh, ii, jj, kk, mm, mm2, nn, oo, pp, qq, rr, ss, tt, vv, ww, xx, yy, zz, x1, x2, x3, A = function A() {
    "use strict";
    _class_call_check(this, A);
}, B = function(A) {
    "use strict";
    _inherits(B, A);
    var _super = _create_super(B);
    function B() {
        return _class_call_check(this, B), _super.apply(this, arguments);
    }
    return B;
}(A);
!function(Compass) {
    Compass[Compass.North = 0] = "North", Compass[Compass.South = 1] = "South", Compass[Compass.East = 2] = "East", Compass[Compass.West = 3] = "West";
}(Compass || (Compass = {}));
var numIndex = {
    3: "three",
    three: "three"
}, strIndex = {
    N: Compass.North,
    E: Compass.East
};
function noIndex() {}
var obj = {
    10: "ten",
    x: "hello",
    y: 32,
    z: {
        n: "world",
        m: 15,
        o: function() {
            return !1;
        }
    },
    "literal property": 100
}, anyVar = {};
obj.y = 4, anyVar.x = anyVar.y = obj.x = anyVar.z;
var aa = obj.x, bb = obj.hasOwnProperty, cc = obj.qqq, dd = obj["literal property"], ee = obj["wa wa wa wa wa"], ff = obj["10"], gg = obj["1"], hh = numIndex[3.0], ii = numIndex[Compass.South], jj = numIndex[anyVar], kk = numIndex.what, ll = numIndex[someObject], mm = strIndex.N, mm2 = strIndex.zzz, nn = strIndex[10], oo = strIndex[Compass.East], pp = strIndex[null], qq = noIndex[123], rr = noIndex.zzzz, ss = noIndex[Compass.South], tt = noIndex[null], uu = noIndex[someObject], vv = noIndex[32], ww = bothIndex[Compass.East], xx = bothIndex[null], yy = bothIndex.foo, zz = bothIndex["1.0"], zzzz = bothIndex[someObject], x1 = numIndex[stringOrNumber], x2 = strIndex[stringOrNumber], x3 = bothIndex[stringOrNumber];
