//// [typeGuardsInDoStatement.ts]
var cond;
function a(x) {
    x = !0;
    do x = void 0;
    while ("string" == typeof x);
}
function b(x) {
    x = !0;
    do {
        if (cond) continue;
        x = void 0;
    }while ("string" == typeof x);
}
function c(x) {
    x = "";
    do {
        if (cond) break;
        x = void 0;
    }while ("string" == typeof x);
}
