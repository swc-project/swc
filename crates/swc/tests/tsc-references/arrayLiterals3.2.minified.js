//// [arrayLiterals3.ts]
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
var _ref = [
    1,
    2,
    "string",
    !0
];
_ref[0], _ref[1];
var temp1 = [
    1,
    2,
    3
];
_to_consumable_array([
    [
        1,
        2,
        3
    ],
    [
        "hello",
        "string"
    ]
]), _to_consumable_array(temp1), _to_consumable_array(temp1).concat(_to_consumable_array([
    "s",
    "t",
    "r"
]));
