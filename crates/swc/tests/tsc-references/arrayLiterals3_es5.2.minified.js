import _to_consumable_array from "@swc/helpers/lib/_to_consumable_array.js";
var ref = [
    1,
    2,
    "string",
    !0
];
ref[0], ref[1];
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
