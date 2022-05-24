import _instanceof from "@swc/helpers/lib/_instanceof.js";
var str;
var num;
var strOrNum;
var c1;
var c2;
var d1;
var c1Orc2;
str = _instanceof(c1Orc2, c1) && c1Orc2.p1; // C1
num = _instanceof(c1Orc2, c2) && c1Orc2.p2; // C2
str = _instanceof(c1Orc2, d1) && c1Orc2.p1; // C1
num = _instanceof(c1Orc2, d1) && c1Orc2.p3; // D1
var c2Ord1;
num = _instanceof(c2Ord1, c2) && c2Ord1.p2; // C2
num = _instanceof(c2Ord1, d1) && c2Ord1.p3; // D1
str = _instanceof(c2Ord1, d1) && c2Ord1.p1; // D1
var r2 = _instanceof(c2Ord1, c1) && c2Ord1; // C2 | D1
