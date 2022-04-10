import * as swcHelpers from "@swc/helpers";
function foo(param) {
    var _x = swcHelpers.slicedToArray(param.x, 2), _y = (_x[0], _x[1], param.y);
    _y.c, _y.d, _y.e;
}
foo({
    x: [
        "string",
        1
    ],
    y: {
        c: !0,
        d: "world",
        e: 3
    }
}), foo({
    x: [
        "string",
        1
    ],
    y: {
        c: !0,
        d: "world",
        e: 3
    }
}), [
    "string",
    1,
    !0
].concat(swcHelpers.toConsumableArray([
    "string",
    1,
    !0
])), foo({
    x: [
        "string",
        1
    ],
    y: {
        c: !0,
        d: "world",
        e: 3
    }
});
