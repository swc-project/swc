// @declaration: true
var x = undefined;
var y = undefined;
if (x === "foo") {
    let a = x;
} else if (x !== "bar") {
    let b = x || y;
} else {
    let c = x;
    let d = y;
    let e = c || d;
}
x = y;
y = x;
