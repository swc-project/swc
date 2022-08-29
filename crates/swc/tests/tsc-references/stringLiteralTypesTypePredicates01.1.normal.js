//// [stringLiteralTypesTypePredicates01.ts]
function kindIs(kind, is) {
    return kind === is;
}
var x = undefined;
if (kindIs(x, "A")) {
    var a = x;
} else {
    var b = x;
}
if (!kindIs(x, "B")) {
    var c = x;
} else {
    var d = x;
}
