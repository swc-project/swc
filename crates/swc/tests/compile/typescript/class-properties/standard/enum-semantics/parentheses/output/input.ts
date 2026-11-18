(function(N) {
    N.x = 31;
    (function(E) {
        E[E["A"] = 2] = "A";
        E["\uD800"] = "surrogate";
    })(N.E || (N.E = {}));
})(N || (N = {}));
var Values = function(Values) {
    Values[Values["Dot"] = 31] = "Dot";
    Values[Values["Computed"] = N["x"]] = "Computed";
    Values[Values["AfterComputed"] = void 0] = "AfterComputed";
    Values[Values["Enum"] = 2] = "Enum";
    Values[Values["AfterEnum"] = void 0] = "AfterEnum";
    return Values;
}(Values || {});
const grouped = 2;
const surrogate = "surrogate";
var N;
