//// [typeGuardOfFormInstanceOfOnInterface.ts]
// A type guard of the form x instanceof C, where C is of a subtype of the global type 'Function' 
// and C has a property named 'prototype'
//  - when true, narrows the type of x to the type of the 'prototype' property in C provided 
//    it is a subtype of the type of x, or
//  - when false, has no effect on the type of x.
import _instanceof from "@swc/helpers/src/_instanceof.mjs";
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
