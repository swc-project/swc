//// [literalTypes3.ts]
function f1(s) {
    if (s === "foo") {
        s; // "foo"
    }
    if (s === "foo" || s === "bar") {
        s; // "foo" | "bar"
    }
}
function f2(s) {
    switch(s){
        case "foo":
        case "bar":
            s; // "foo" | "bar"
        case "baz":
            s; // "foo" | "bar" | "baz"
            break;
        default:
            s; // string
    }
}
function f3(s) {
    return s === "foo" || s === "bar" ? s : undefined; // "foo" | "bar" | undefined
}
function f4(x) {
    if (x === 1 || x === 2) {
        return x; // 1 | 2
    }
    throw new Error();
}
function f5(x, y) {
    if (x === 0 || x === y) {
        x; // 0 | 1 | 2
    }
}
function f6(x, y) {
    if (y === x || 0 === x) {
        x; // 0 | 1 | 2
    }
}
function f7(x, y) {
    if (x === y) {
        x; // "foo" | "bar" | 1 | 2
    }
}
function f8(x) {
    switch(x){
        case 1:
        case 2:
            x; // 1 | 2
            break;
        case "foo":
            x; // "foo"
            break;
        default:
            x; // number | "bar"
    }
}
