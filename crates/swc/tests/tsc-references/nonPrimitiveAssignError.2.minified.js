//// [nonPrimitiveAssignError.ts]
var a, x = {}, y = {
    foo: "bar"
};
x = a, y = a, a = x, a = y;
var s = "fooo";
a = 123, a = !0, s = a = s, a = 123, a = !0, a = "string";
