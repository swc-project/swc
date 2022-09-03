//// [typeGuardsInForStatement.ts]
var cond;
function a(x) {
    for(x = void 0; "number" != typeof x; x = void 0);
}
function b(x) {
    for(x = void 0; "number" != typeof x; x = void 0)if (cond) continue;
}
function c(x) {
    for(x = void 0; "number" != typeof x && !cond; x = void 0);
}
