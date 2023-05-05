//// [instanceofOperatorWithRHSIsSubtypeOfFunction.ts]
var x, f1, f2, f3, f4;
import { _ as _instanceof } from "@swc/helpers/_/_instanceof";
_instanceof(x, f1), _instanceof(x, f2), _instanceof(x, f3), _instanceof(x, f4), _instanceof(x, null), _instanceof(x, void 0);
