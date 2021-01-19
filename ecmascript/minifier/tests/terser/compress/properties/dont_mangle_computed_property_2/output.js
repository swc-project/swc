const n = Symbol("foo"),
    o = {
        [n]: "bar",
        o: 1,
        i: 2,
        7: "seven",
        0: "zero",
        1: "one",
        null: "Null",
        undefined: "Undefined",
        Infinity: "infinity",
        NaN: "nan",
        l: "Void",
    };
console.log(
    o[n],
    o.o,
    o.i,
    o[7],
    o[0],
    o[1],
    o.null,
    o[void 0],
    o[1 / 0],
    o.NaN,
    o.l
),
    console.log(o.null, o.undefined, o.Infinity, o.NaN);
