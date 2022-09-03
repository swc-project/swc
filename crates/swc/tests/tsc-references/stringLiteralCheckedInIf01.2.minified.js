//// [stringLiteralCheckedInIf01.ts]
function f(foo) {
    return "a" === foo ? foo : "b" === foo ? foo : foo[0];
}
