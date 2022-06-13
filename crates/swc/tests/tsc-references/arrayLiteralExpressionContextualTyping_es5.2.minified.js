import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
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
