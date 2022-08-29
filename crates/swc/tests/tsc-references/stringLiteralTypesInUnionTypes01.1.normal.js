//// [stringLiteralTypesInUnionTypes01.ts]
var x = undefined;
var y = undefined;
if (x === "foo") {
    var a = x;
} else if (x !== "bar") {
    var b = x || y;
} else {
    var c = x;
    var d = y;
    var e = c || d;
}
x = y;
y = x;
