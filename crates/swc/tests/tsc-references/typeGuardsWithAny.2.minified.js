//// [typeGuardsWithAny.ts]
import { _ as _instanceof } from "@swc/helpers/_/_instanceof";
import { _ as _type_of } from "@swc/helpers/_/_type_of";
var x = {
    p: 0
};
_instanceof(x, Object), x.p, x.p, x.p, x.p, _type_of(x), x.p;
