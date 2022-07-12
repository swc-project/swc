// @declaration: true
function hasKind(entity, kind) {
    return entity.kind === kind;
}
let x = {
    kind: "A",
    a: 100
};
if (hasKind(x, "A")) {
    let a = x;
} else {
    let b = x;
}
if (!hasKind(x, "B")) {
    let c = x;
} else {
    let d = x;
}
