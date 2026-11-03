(function(Numbers) {
    Numbers.Infinity = 7;
    Numbers.NaN = 8;
    (function(E) {
        E[E["A"] = 7] = "A";
        E[E["B"] = 8] = "B";
    })(Numbers.E || (Numbers.E = {}));
})(Numbers || (Numbers = {}));
function shadowed(Infinity) {
    let E = function(E) {
        E[E["A"] = Infinity] = "A";
        return E;
    }({});
    return E.A;
}
var Numeric = /*#__PURE__*/ function(Numeric) {
    Numeric[Numeric["NegativeZero"] = -0] = "NegativeZero";
    Numeric[Numeric["NegativeInfinity"] = -1 / 0] = "NegativeInfinity";
    Numeric[Numeric["Nan"] = 0 / 0] = "Nan";
    Numeric[Numeric["Shift"] = 2147483647] = "Shift";
    Numeric[Numeric["Signed"] = -1] = "Signed";
    Numeric[Numeric["Raw"] = 0x10] = "Raw";
    Numeric[Numeric["Computed"] = 17] = "Computed";
    return Numeric;
}(Numeric || {});
const result = [
    7,
    8,
    2147483647,
    -1
];
var Numbers;
