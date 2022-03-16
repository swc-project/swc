import * as swcHelpers from "@swc/helpers";
function foo(param) {
    var _x = swcHelpers.slicedToArray(param.x, 2), _y = (_x[0], _x[1], param.y);
    _y.c, _y.d, _y.e;
}
function baz(x) {}
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
});
var array = [
    "string",
    1,
    !0
];
baz([
    "string",
    1,
    !0
]), baz([
    "string",
    1,
    !0
]), baz(array), baz([
    "string",
    1,
    !0
].concat(swcHelpers.toConsumableArray(array))), foo({
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
