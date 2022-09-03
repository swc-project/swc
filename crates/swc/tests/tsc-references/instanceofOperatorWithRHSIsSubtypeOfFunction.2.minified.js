//// [instanceofOperatorWithRHSIsSubtypeOfFunction.ts]
import _instanceof from "@swc/helpers/src/_instanceof.mjs";
var x, f1, f2, f3, f4, r1 = _instanceof(x, f1), r2 = _instanceof(x, f2), r3 = _instanceof(x, f3), r4 = _instanceof(x, f4), r5 = _instanceof(x, null), r6 = _instanceof(x, void 0);
