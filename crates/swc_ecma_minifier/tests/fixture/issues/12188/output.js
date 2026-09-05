var identifierResult;
function member(a, b) {
    let index = 0;
    a[index++] = (console.log("member test", index), b) ? 1 : 2, console.log("member result", index, a[0]);
}
function destructuring(a, b) {
    let index = 0;
    [a[index++]] = (console.log("destructuring test", index), b) ? [
        1
    ] : [
        2
    ], console.log("destructuring result", index, a[0]);
}
function identifier(b) {
    console.log("identifier test"), console.log("identifier result", b ? 1 : 2);
}
member([], !0), destructuring([], !0), identifier(!0);
