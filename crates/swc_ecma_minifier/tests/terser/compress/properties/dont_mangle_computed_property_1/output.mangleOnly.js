"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
"BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB";
"CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC";
const a = Symbol("foo");
const b = {
    [a]: "bar",
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
console.log(b[a], b["baz"], b.qux, b[7], b[0], b[1 + 0], b[null], b[undefined], b[1 / 0], b[NaN], b.void);
console.log(b.null, b.undefined, b.Infinity, b.NaN);
