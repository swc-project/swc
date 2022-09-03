//// [controlFlowIfStatement.ts]
var x, cond;
function a() {
    if (!cond) return;
}
function b() {
    if (cond) throw "";
}
function c(data) {
    return "string" == typeof data ? JSON.parse(data) : data;
}
function d(data) {
    if ("string" != typeof data) return data;
    throw Error("will always happen");
}
function e(x) {
    x.p;
}
x = /a/, x = !0, x = "";
