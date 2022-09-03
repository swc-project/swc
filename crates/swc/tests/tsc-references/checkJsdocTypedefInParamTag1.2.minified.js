//// [checkJsdocTypedefInParamTag1.ts]
//// [0.js]
function foo(opts) {
    opts.x;
}
function foo1(opts) {
    opts.anotherX;
}
function foo2(opts) {
    opts.x;
}
foo({
    x: "abc"
}), foo1({
    anotherX: "world"
}), foo2({
    x: "abc"
});
