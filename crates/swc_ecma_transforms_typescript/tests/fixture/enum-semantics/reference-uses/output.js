(function(Values) {
    (function(E) {
        E[E["A"] = 31] = "A";
        E[E["B"] = 32] = "B";
    })(Values.E || (Values.E = {}));
})(Values || (Values = {}));
const direct = 32;
var ObjectValues = /*#__PURE__*/ function(ObjectValues) {
    ObjectValues[ObjectValues["A"] = 41] = "A";
    return ObjectValues;
}(ObjectValues || {});
const shorthand = {
    ObjectValues
};
export { ObjectValues };
var AliasValues = /*#__PURE__*/ function(AliasValues) {
    AliasValues[AliasValues["A"] = 51] = "A";
    return AliasValues;
}(AliasValues || {});
const Live = AliasValues;
const aliases = {
    Live
};
var Mutating = /*#__PURE__*/ function(Mutating) {
    Mutating[Mutating["A"] = 61] = "A";
    return Mutating;
}(Mutating || {});
Mutating.A++;
const mutation = Reflect.get(Mutating, "A");
var Values;
