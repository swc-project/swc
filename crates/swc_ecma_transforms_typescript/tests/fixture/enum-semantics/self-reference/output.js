function runtime() {
    return 3;
}
var E = function(E) {
    E[E["A"] = runtime()] = "A";
    E[E["B"] = E.A] = "B";
    E[E["C"] = E.A + 1] = "C";
    E[E["Deferred"] = (()=>E.C)()] = "Deferred";
    return E;
}(E || {});
const result = [
    E.A,
    E.B,
    E.C,
    E.Deferred
];
