//// [controlFlowTypeofObject.ts]
function f1(x) {
    x && "object" == typeof x && obj(x);
}
function f2(x) {
    null !== x && "object" == typeof x && obj(x);
}
function f3(x) {
    null != x && "object" == typeof x && obj(x);
}
function f4(x) {
    void 0 != x && "object" == typeof x && obj(x);
}
function f5(x) {
    x && "object" == typeof x && obj(x);
}
function f6(x) {
    null === x || "object" == typeof x && obj(x), "object" == typeof x && obj(x);
}
