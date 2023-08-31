//// [main.ts]
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
[
    3
].concat(_to_consumable_array([
    1,
    ,
    2
]), [
    4
]);
//// [tslib.d.ts]
// this is a pre-TS4.4 versions of emit helper, which always forced array packing
