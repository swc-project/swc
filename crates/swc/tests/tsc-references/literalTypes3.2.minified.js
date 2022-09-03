//// [literalTypes3.ts]
function f1(s) {}
function f2(s) {}
function f3(s) {
    return "foo" === s || "bar" === s ? s : void 0;
}
function f4(x) {
    if (1 === x || 2 === x) return x;
    throw Error();
}
function f5(x, y) {}
function f6(x, y) {}
function f7(x, y) {}
function f8(x) {}
