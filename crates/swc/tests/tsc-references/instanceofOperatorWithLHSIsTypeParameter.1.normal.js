//// [instanceofOperatorWithLHSIsTypeParameter.ts]
import { _ as _instanceof } from "@swc/helpers/_/_instanceof";
function foo(t) {
    var x;
    var r = _instanceof(t, x);
}
