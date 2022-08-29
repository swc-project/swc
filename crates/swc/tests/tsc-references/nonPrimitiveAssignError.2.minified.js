//// [nonPrimitiveAssignError.ts]
var a, x = {}, y = {
    foo: "bar"
};
x = a, y = a, a = x, a = y;
var n = 123, b = !0, s = "fooo";
a = n, a = b, n = a = s, b = a, s = a, a = 123, a = !0, a = "string";
