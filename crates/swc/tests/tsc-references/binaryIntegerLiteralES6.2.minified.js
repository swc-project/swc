//// [binaryIntegerLiteralES6.ts]
var bin1 = 0b11010, bin2 = 0B11010, bin3 = 0B11111111111111111111111111111111111111111111111101001010100000010111110001111111111, bin4 = Infinity, obj1 = {
    0b11010: "Hello",
    a: bin1,
    bin1,
    b: 0b11010,
    Infinity: !0
}, obj2 = {
    0B11010: "World",
    a: bin2,
    bin2,
    b: 0B11010,
    0B11111111111111111111111111111111111111111111111101001010100000010111110001111111111: !1
};
obj1[0b11010], obj1[26], obj1["26"], obj1["0b11010"], obj1.a, obj1.b, obj1.bin1, obj1.Infinity, obj2[0B11010], obj2[26], obj2["26"], obj2["0B11010"], obj2.a, obj2.b, obj2.bin2, obj2[9.671406556917009e+24], obj2["9.671406556917009e+24"], obj2.Infinity;
