export var Test = /*#__PURE__*/ function(Test) {
    Test[Test["A"] = 1073741824] = "A";
    Test[Test["B"] = -2147483648] = "B";
    Test[Test["C"] = -1073741824] = "C";
    return Test;
}({});
var a = 1 << 30; // 1073741824
var b = 1 << 31; // -2147483648
var c = 1 << 30 | 1 << 31; // -1073741824
