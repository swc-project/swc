import * as swcHelpers from "@swc/helpers";
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
swcHelpers.toConsumableArray([
    [
        1,
        2,
        3
    ],
    [
        "hello",
        "string"
    ]
]), swcHelpers.toConsumableArray(temp1), swcHelpers.toConsumableArray(temp1).concat(swcHelpers.toConsumableArray([
    "s",
    "t",
    "r"
]));
