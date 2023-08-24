//// [typeGuardOfFormInstanceOfOnInterface.ts]
// A type guard of the form x instanceof C, where C is of a subtype of the global type 'Function' 
// and C has a property named 'prototype'
//  - when true, narrows the type of x to the type of the 'prototype' property in C provided 
//    it is a subtype of the type of x, or
//  - when false, has no effect on the type of x.
var c1, c2, d1, c1Orc2, c2Ord1;
import { _ as _instanceof } from "@swc/helpers/_/_instanceof";
_instanceof(c1Orc2, c1) && c1Orc2.p1, _instanceof(c1Orc2, c2) && c1Orc2.p2, _instanceof(c1Orc2, d1) && c1Orc2.p1, _instanceof(c1Orc2, d1) && c1Orc2.p3, _instanceof(c2Ord1, c2) && c2Ord1.p2, _instanceof(c2Ord1, d1) && c2Ord1.p3, _instanceof(c2Ord1, d1) && c2Ord1.p1, _instanceof(c2Ord1, c1);
 // C2 | D1
