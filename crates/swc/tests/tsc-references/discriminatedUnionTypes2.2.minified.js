//// [discriminatedUnionTypes2.ts]
function f10(x) {
    !1 === x.kind ? x.a : !0 === x.kind ? x.b : x.c;
}
function f11(x) {
    switch(x.kind){
        case !1:
            x.a;
            break;
        case !0:
            x.b;
            break;
        default:
            x.c;
    }
}
function f13(x) {}
function f14(x) {
    0 === x.a && x.b;
}
function f15(x) {
    x.error ? x.error.message : x.value;
}
function f20(carrier) {
    carrier.error, carrier.error, carrier.data;
}
function f30(foo) {
    foo.tag;
}
function f31(foo) {
    foo.tag;
}
function f(problem) {
    "b" === problem.type ? problem.name : problem.other;
}
function foo1(x) {
    x.type, x.value;
}
function foo2(x) {
    x.type, x.value;
}
f15({
    value: 10
}), f15({
    error: Error("boom")
});
