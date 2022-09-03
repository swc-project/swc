//// [arrayLiterals3.ts]
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
var a0 = [], a1 = [
    "string",
    1,
    !0
], ref = [
    1,
    2,
    "string",
    !0
], b1 = ref[0], b2 = ref[1], temp = [
    "s",
    "t",
    "r"
], temp1 = [
    1,
    2,
    3
], temp2 = [
    [
        1,
        2,
        3
    ],
    [
        "hello",
        "string"
    ]
], c0 = _to_consumable_array(temp2), c1 = _to_consumable_array(temp1), c2 = _to_consumable_array(temp1).concat(_to_consumable_array(temp));
