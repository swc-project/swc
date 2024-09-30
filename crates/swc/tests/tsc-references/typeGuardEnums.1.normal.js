//// [typeGuardEnums.ts]
var E = /*#__PURE__*/ function(E) {
    return E;
}(E || {});
var V = /*#__PURE__*/ function(V) {
    return V;
}(V || {});
var x;
if (typeof x === "number") {
    x; // number|E|V
} else {
    x; // string
}
if (typeof x !== "number") {
    x; // string
} else {
    x; // number|E|V
}
