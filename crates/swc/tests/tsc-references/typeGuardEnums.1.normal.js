//// [typeGuardEnums.ts]
var E;
(function(E) {})(E || (E = {}));
var V;
(function(V) {})(V || (V = {}));
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
