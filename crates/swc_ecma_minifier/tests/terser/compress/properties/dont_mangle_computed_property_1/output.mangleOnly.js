"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
"BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB";
"CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC";
const b = Symbol("foo");
const a = {
    [b]: "bar",
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
console.log(a[b], a["baz"], a.qux, a[7], a[0], a[1 + 0], a[null], a[undefined], a[1 / 0], a[NaN], a.void);
console.log(a.null, a.undefined, a.Infinity, a.NaN);
