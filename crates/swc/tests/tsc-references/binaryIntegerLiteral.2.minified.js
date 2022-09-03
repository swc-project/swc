//// [binaryIntegerLiteral.ts]
var bin1 = 26, bin2 = 26, bin3 = 9671406556917009000000000, bin4 = Infinity, obj1 = {
    26: "Hello",
    a: bin1,
    bin1: bin1,
    b: 26,
    Infinity: !0
}, obj2 = {
    26: "World",
    a: bin2,
    bin2: bin2,
    b: 26,
    9671406556917009000000000: !1
};
obj1[26], obj1[26], obj1["26"], obj1["0b11010"], obj1.a, obj1.b, obj1.bin1, obj1.Infinity, obj2[26], obj2[26], obj2["26"], obj2["0B11010"], obj2.a, obj2.b, obj2.bin2, obj2[9.671406556917009e+24], obj2["9.671406556917009e+24"], obj2.Infinity;
