const n = Symbol("foo");
const i = {
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
    void: "Void"
};
console.log(i[n], i["baz"], i.qux, i[7], i[0], i[1 + 0], i[null], i[undefined], i[1 / 0], i[NaN], i.void);
console.log(i.null, i.undefined, i.Infinity, i.NaN);
