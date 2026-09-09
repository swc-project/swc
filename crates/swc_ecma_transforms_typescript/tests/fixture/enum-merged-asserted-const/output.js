var E = /*#__PURE__*/ function(E) {
    E[E["B"] = 1] = "B";
    return E;
}(E || {});
(function(E) {
    E[E["D"] = 2] = "D";
})(E);
if (E.B !== 1 || E.D !== 2) {
    throw new Error("Merged const enum members lost their values");
}
