//// [nonPrimitiveAssignError.ts]
var a, x = {}, y = {};
x = a, y = a, a = x, a = y;
var s = "fooo";
a = 123, a = !0, s = a = s;
