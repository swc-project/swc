//// [main.ts]
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
var k = [
    1,
    ,
    2
];
var o = [
    3
].concat(_to_consumable_array(k), [
    4
]);
export { };
//// [tslib.d.ts]
// this is a pre-TS4.4 versions of emit helper, which always forced array packing
