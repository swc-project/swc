//// [arrayLiteralExpressionContextualTyping.ts]
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
var array = [
    1,
    2,
    3
], array1 = [
    !0,
    2,
    3
], tup = [
    1,
    2,
    3,
    4
], tup1 = [
    1,
    2,
    3,
    "string"
], tup2 = [
    1,
    2,
    3,
    "string"
], spr = [
    1,
    2,
    3
].concat(_to_consumable_array(array)), spr1 = [
    1,
    2,
    3
].concat(_to_consumable_array(tup)), spr2 = [
    1,
    2,
    3
].concat(_to_consumable_array(tup));
