//// [stringLiteralTypesInUnionTypes01.ts]
var x = void 0, y = void 0;
if ("foo" === x) var a = x;
else if ("bar" !== x) var b = x || y;
else var c = x, d = y, e = c || d;
y = x = y;
