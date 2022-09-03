//// [stringLiteralCheckedInIf02.ts]
function isS(t) {
    return "a" === t || "b" === t;
}
function f(foo) {
    return isS(foo) ? foo : foo[0];
}
