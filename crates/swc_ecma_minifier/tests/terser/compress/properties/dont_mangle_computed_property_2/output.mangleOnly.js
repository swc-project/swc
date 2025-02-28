const o = Symbol("foo");
const n = {
    [o]: "bar",
    baz: 1,
    qux: 2,
    [3 + 4]: "seven",
    0: "zero",
    1: "one",
    null: "Null",
    undefined: "Undefined",
    Infinity: "infinity",
    NaN: "nan",
    void: "Void"
};
console.log(n[o], n["baz"], n.qux, n[7], n[0], n[1 + 0], n[null], n[undefined], n[1 / 0], n[NaN], n.void);
console.log(n.null, n.undefined, n.Infinity, n.NaN);
