var Strings = /*#__PURE__*/ function(Strings) {
    Strings["A"] = "x";
    Strings["B"] = "x";
    Strings["C"] = "x";
    return Strings;
}(Strings || {});
var Numbers = /*#__PURE__*/ function(Numbers) {
    Numbers[Numbers["A"] = 1] = "A";
    Numbers[Numbers["B"] = 2] = "B";
    Numbers[Numbers["C"] = 3] = "C";
    return Numbers;
}(Numbers || {});
var Merged = /*#__PURE__*/ function(Merged) {
    Merged["A"] = "merged";
    return Merged;
}(Merged || {});
(function(Merged) {
    Merged["B"] = "merged";
})(Merged);
var Forward = function(Forward) {
    Forward[Forward["A"] = Forward.B] = "A";
    Forward["B"] = "later";
    return Forward;
}(Forward || {});
var Cycle = function(Cycle) {
    Cycle[Cycle["A"] = Cycle.B] = "A";
    Cycle[Cycle["B"] = Cycle.A] = "B";
    return Cycle;
}(Cycle || {});
console.log(Strings, "x", Numbers, Merged, Forward, Cycle);
