//// [stringLiteralTypesInUnionTypes04.ts]
var x = undefined;
var y = undefined;
if (x === "") {
    var a = x;
}
if (x !== "") {
    var b = x;
}
if (x == "") {
    var c = x;
}
if (x != "") {
    var d = x;
}
if (x) {
    var e = x;
}
if (!x) {
    var f = x;
}
if (!!x) {
    var g = x;
}
if (!!!x) {
    var h = x;
}
