//// [stringLiteralCheckedInIf01.ts]
function f(foo) {
    if (foo === "a") {
        return foo;
    } else if (foo === "b") {
        return foo;
    } else {
        return foo[0];
    }
}
