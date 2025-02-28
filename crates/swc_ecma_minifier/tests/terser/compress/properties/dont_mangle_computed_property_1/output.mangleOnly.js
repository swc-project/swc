"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
"BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB";
"CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC";
const B = Symbol("foo");
const A = {
    [B]: "bar",
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
console.log(A[B], A["baz"], A.qux, A[7], A[0], A[1 + 0], A[null], A[undefined], A[1 / 0], A[NaN], A.void);
console.log(A.null, A.undefined, A.Infinity, A.NaN);
