//// [nonPrimitiveAssignError.ts]
var a, x = {}, y = {
    foo: "bar"
};
x = a, y = a, a = x, a = y;
var n = 123, b = !0, s = "fooo";
a = n, a = b, n = a = s, b = a, s = a;
var numObj = 123, boolObj = !0, strObj = "string";
a = numObj, a = boolObj, a = strObj;
