//// [typeGuardOfFormIsType.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var C1 = function C1() {
    "use strict";
    _class_call_check(this, C1);
};
var C2 = function C2() {
    "use strict";
    _class_call_check(this, C2);
};
var D1 = /*#__PURE__*/ function(C1) {
    "use strict";
    _inherits(D1, C1);
    function D1() {
        _class_call_check(this, D1);
        return _call_super(this, D1, arguments);
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
