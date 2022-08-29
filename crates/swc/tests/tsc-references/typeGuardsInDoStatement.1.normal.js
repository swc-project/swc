//// [typeGuardsInDoStatement.ts]
var cond;
function a(x) {
    x = true;
    do {
        x; // boolean | string
        x = undefined;
    }while (typeof x === "string");
    x; // number | boolean
}
function b(x) {
    x = true;
    do {
        x; // boolean | string
        if (cond) continue;
        x = undefined;
    }while (typeof x === "string");
    x; // number | boolean
}
function c(x) {
    x = "";
    do {
        x; // string
        if (cond) break;
        x = undefined;
    }while (typeof x === "string");
    x; // string | number
}
