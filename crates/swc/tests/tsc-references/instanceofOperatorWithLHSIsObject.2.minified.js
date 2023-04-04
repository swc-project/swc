//// [instanceofOperatorWithLHSIsObject.ts]
var x1, x2, a, b, c, d;
import "@swc/helpers/_/_class_call_check";
import { _ as _instanceof } from "@swc/helpers/_/_instanceof";
_instanceof(a, x1), _instanceof(b, x2), _instanceof(c, x1), _instanceof(d, x1);
