//// [arrayLiteralExpressionContextualTyping.ts]
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
var tup = [
    1,
    2,
    3,
    4
];
[
    1,
    2,
    3
].concat(_to_consumable_array([
    1,
    2,
    3
])), [
    1,
    2,
    3
].concat(_to_consumable_array(tup)), [
    1,
    2,
    3
].concat(_to_consumable_array(tup));
