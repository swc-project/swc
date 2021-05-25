"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
"BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB";
"CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC";
const prop = Symbol("foo");
const obj = {
    [prop]: "bar",
    A: 1,
    B: 2,
    [3 + 4]: "seven",
    0: "zero",
    1: "one",
    null: "Null",
    undefined: "Undefined",
    Infinity: "infinity",
    NaN: "nan",
    C: "Void",
};
console.log(
    obj[prop],
    obj["A"],
    obj.B,
    obj[7],
    obj[0],
    obj[1 + 0],
    obj[null],
    obj[void 0],
    obj[1 / 0],
    obj[NaN],
    obj.C
);
console.log(obj.null, obj.undefined, obj.Infinity, obj.NaN);
