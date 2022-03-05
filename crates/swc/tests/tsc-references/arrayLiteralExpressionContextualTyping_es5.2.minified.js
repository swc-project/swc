import * as swcHelpers from "@swc/helpers";
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
].concat(swcHelpers.toConsumableArray([
    1,
    2,
    3
])), [
    1,
    2,
    3
].concat(swcHelpers.toConsumableArray(tup)), [
    1,
    2,
    3
].concat(swcHelpers.toConsumableArray(tup));
