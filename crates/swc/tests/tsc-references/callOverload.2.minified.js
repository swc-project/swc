//// [callOverload.ts]
var n;
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
fn(1), fn(1, 2, 3, 4), takeTwo(1, 2, 3, 4), withRest.apply(void 0, [
    'a'
].concat(_to_consumable_array(n))), withRest(), withRest.apply(void 0, _to_consumable_array(n));
