function foo({ x: [a, b] , y: { c , d , e  }  }) {
}
function baz(x) {
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
    !0,
    ...array
]), foo({
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
