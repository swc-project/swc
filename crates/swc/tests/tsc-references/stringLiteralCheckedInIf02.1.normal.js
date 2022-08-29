//// [stringLiteralCheckedInIf02.ts]
function isS(t) {
    return t === "a" || t === "b";
}
function f(foo) {
    if (isS(foo)) {
        return foo;
    } else {
        return foo[0];
    }
}
