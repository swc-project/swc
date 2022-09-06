"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
"BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB";
"CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC";
const A = Symbol("foo");
const B = {
    [A]: "bar",
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
    B[A],
    B["baz"],
    B.qux,
    B[7],
    B[0],
    B[1 + 0],
    B[null],
    B[undefined],
    B[1 / 0],
    B[NaN],
    B.void
);
console.log(B.null, B.undefined, B.Infinity, B.NaN);
