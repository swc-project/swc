const n = Symbol("foo");
const o = {
    [n]: "bar",
    baz: 1,
    qux: 2,
    [3 + 4]: "seven",
    0: "zero",
    1: "one",
    null: "Null",
    undefined: "Undefined",
    Infinity: "infinity",
    NaN: "nan",
    void: "Void",
};
console.log(
    o[n],
    o["baz"],
    o.qux,
    o[7],
    o[0],
    o[1 + 0],
    o[null],
    o[undefined],
    o[1 / 0],
    o[NaN],
    o.void
);
console.log(o.null, o.undefined, o.Infinity, o.NaN);
