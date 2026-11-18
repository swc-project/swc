const Alias = Ambient.E;
const folded = 31;
var Values = /*#__PURE__*/ function(Values) {
    Values[Values["A"] = 32] = "A";
    Values[Values["B"] = 31] = "B";
    Values[Values["C"] = 32] = "C";
    return Values;
}(Values || {});
var FromPlain = function(FromPlain) {
    FromPlain[FromPlain["A"] = 33] = "A";
    FromPlain[FromPlain["B"] = Plain.B] = "B";
    return FromPlain;
}(FromPlain || {});
const runtimeRead = Plain.A;
