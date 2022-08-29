//// [controlFlowCommaOperator.ts]
function f(x) {
    var y = false;
    var z = false;
    if (y = "", typeof x === "string") {
        x; // string
        y; // string
        z; // boolean
    } else if (z = 1, typeof x === "number") {
        x; // number
        y; // string
        z; // number
    } else {
        x; // boolean
        y; // string
        z; // number
    }
    x; // string | number | boolean
    y; // string
    z; // number | boolean
}
