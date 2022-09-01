//// [instanceofOperatorWithInvalidOperands.ts]
var x, a1, a2, a3, a4, b1, b2, b3, b4, o1, o2, o3;
import _instanceof from "@swc/helpers/src/_instanceof.mjs";
_instanceof(a1, x), _instanceof(a2, x), _instanceof(a3, x), _instanceof(a4, x), _instanceof(0, x), _instanceof(!0, x), _instanceof("", x), _instanceof(null, x), _instanceof(void 0, x), _instanceof(x, b1), _instanceof(x, b2), _instanceof(x, b3), _instanceof(x, b4), _instanceof(x, 0), _instanceof(x, !0), _instanceof(x, ""), _instanceof(x, o1), _instanceof(x, o2), _instanceof(x, o3), _instanceof("", {});
