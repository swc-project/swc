import * as swcHelpers from "@swc/helpers";
var C1 = function C1() {
    "use strict";
    swcHelpers.classCallCheck(this, C1);
};
var C2 = function C2() {
    "use strict";
    swcHelpers.classCallCheck(this, C2);
};
var D1 = /*#__PURE__*/ function(C1) {
    "use strict";
    swcHelpers.inherits(D1, C1);
    var _super = swcHelpers.createSuper(D1);
    function D1() {
        swcHelpers.classCallCheck(this, D1);
        return _super.apply(this, arguments);
    }
    return D1;
}(C1);
var str;
var num;
var strOrNum;
function isC1(x) {
    return true;
}
function isC2(x) {
    return true;
}
function isD1(x) {
    return true;
}
var c1Orc2;
str = isC1(c1Orc2) && c1Orc2.p1; // C1
num = isC2(c1Orc2) && c1Orc2.p2; // C2
str = isD1(c1Orc2) && c1Orc2.p1; // D1
num = isD1(c1Orc2) && c1Orc2.p3; // D1
var c2Ord1;
num = isC2(c2Ord1) && c2Ord1.p2; // C2
num = isD1(c2Ord1) && c2Ord1.p3; // D1
str = isD1(c2Ord1) && c2Ord1.p1; // D1
var r2 = isC1(c2Ord1) && c2Ord1; // C2 | D1
