const prop = Symbol("foo");
const obj = {
    [prop]: "bar",
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
    obj[prop],
    obj["baz"],
    obj.qux,
    obj[7],
    obj[0],
    obj[1 + 0],
    obj[null],
    obj[undefined],
    obj[1 / 0],
    obj[NaN],
    obj.void
);
console.log(obj.null, obj.undefined, obj.Infinity, obj.NaN);
