//// [typeGuardsInWhileStatement.ts]
var cond;
function a(x) {
    while(typeof x === "string"){
        x; // string
        x = undefined;
    }
    x; // number
}
function b(x) {
    while(typeof x === "string"){
        if (cond) continue;
        x; // string
        x = undefined;
    }
    x; // number
}
function c(x) {
    while(typeof x === "string"){
        if (cond) break;
        x; // string
        x = undefined;
    }
    x; // string | number
}
