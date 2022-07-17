// @target: es6
var bin1 = 26;
var bin2 = 26;
var bin3 = 9671406556917009000000000;
var bin4 = Infinity;
var obj1 = {
    26: "Hello",
    a: bin1,
    bin1: bin1,
    b: 26,
    Infinity: true
};
var obj2 = {
    26: "World",
    a: bin2,
    bin2: bin2,
    b: 26,
    9671406556917009000000000: false
};
obj1[26]; // string
obj1[26]; // string
obj1["26"]; // string
obj1["0b11010"]; // any
obj1["a"]; // number
obj1["b"]; // number
obj1["bin1"]; // number
obj1["Infinity"]; // boolean
obj2[26]; // string
obj2[26]; // string
obj2["26"]; // string
obj2["0B11010"]; // any
obj2["a"]; // number
obj2["b"]; // number
obj2["bin2"]; // number
obj2[9.671406556917009e+24]; // boolean
obj2["9.671406556917009e+24"]; // boolean
obj2["Infinity"]; // any
