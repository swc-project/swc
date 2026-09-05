function templateLeading(x) {
    return [, `${x}`, "a"].join("-");
}

function templateInterior(x) {
    return [`${x}`, , "a"].join("-");
}

function templateTrailing(x) {
    return [`${x}`, "a", ,].join("-");
}

function templateControl(x) {
    return [`${x}`, "a"].join("-");
}

console.log([
    templateLeading("x"),
    templateInterior("x"),
    templateTrailing("x"),
    templateControl("x"),
].join("|"));
