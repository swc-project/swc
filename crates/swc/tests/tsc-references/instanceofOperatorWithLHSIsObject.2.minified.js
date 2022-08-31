//// [instanceofOperatorWithLHSIsObject.ts]
var x1, x2, b, c, d;
import _instanceof from "@swc/helpers/src/_instanceof.mjs";
_instanceof(void 0, x1), _instanceof(b, x2), _instanceof(c, x1), _instanceof(d, x1);
