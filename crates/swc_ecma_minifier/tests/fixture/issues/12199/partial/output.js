function partialLeading(x) {
    return [
        "-1-2",
        x
    ].join("-");
}
function partialInterior(x) {
    return [
        "1--2",
        x
    ].join("-");
}
function partialTrailing(x) {
    return [
        x,
        "1-2-"
    ].join("-");
}
function partialControl(x) {
    return [
        "1-2",
        x
    ].join("-");
}
console.log([
    partialLeading("x"),
    partialInterior("x"),
    partialTrailing("x"),
    partialControl("x")
].join("|"));
