//// [invalidEnumAssignments.ts]
var E = /*#__PURE__*/ function(E) {
    E[E["A"] = 0] = "A";
    E[E["B"] = 1] = "B";
    return E;
}(E || {});
var E2 = /*#__PURE__*/ function(E2) {
    E2[E2["A"] = 0] = "A";
    E2[E2["B"] = 1] = "B";
    return E2;
}(E2 || {});
var e;
var e2;
e = 0;
e2 = 0;
e = null;
e = {};
e = '';
function f(a) {
    e = a;
}
