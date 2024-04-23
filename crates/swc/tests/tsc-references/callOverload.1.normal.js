//// [callOverload.ts]
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
var n;
fn(1) // no error
;
fn(1, 2, 3, 4);
takeTwo(1, 2, 3, 4);
withRest.apply(void 0, [
    'a'
].concat(_to_consumable_array(n))); // no error
withRest();
withRest.apply(void 0, _to_consumable_array(n));
