// @declaration: true
function kindIs(kind, is) {
    return kind === is;
}
var x = undefined;
if (kindIs(x, "A")) {
    let a = x;
} else {
    let b = x;
}
if (!kindIs(x, "B")) {
    let c = x;
} else {
    let d = x;
}
