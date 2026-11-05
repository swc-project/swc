function templateLeading(x) {
    return `-${x}-a`;
}
function templateInterior(x) {
    return `${x}--a`;
}
function templateTrailing(x) {
    return `${x}-a-`;
}
function templateControl(x) {
    return `${x}-a`;
}
console.log([
    templateLeading("x"),
    templateInterior("x"),
    templateTrailing("x"),
    templateControl("x")
].join("|"));
