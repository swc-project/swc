//// [typeGuardsWithAny.ts]
import { _ as _instanceof } from "@swc/helpers/_/_instanceof";
var x = {
    p: 0
};
_instanceof(x, Object), x.p, x.p, x.p, x.p, x.p;
