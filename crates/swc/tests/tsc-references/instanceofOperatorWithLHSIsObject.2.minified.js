//// [instanceofOperatorWithLHSIsObject.ts]
var x1, x2, a, b, c, d;
import _instanceof from "@swc/helpers/src/_instanceof.mjs";
_instanceof(a, x1), _instanceof(b, x2), _instanceof(c, x1), _instanceof(d, x1);
