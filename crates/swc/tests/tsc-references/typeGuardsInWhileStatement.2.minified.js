//// [typeGuardsInWhileStatement.ts]
var cond;
function a(x) {
    for(; "string" == typeof x;)x = void 0;
}
function b(x) {
    for(; "string" == typeof x;)cond || (x = void 0);
}
function c(x) {
    for(; "string" == typeof x && !cond;)x = void 0;
}
