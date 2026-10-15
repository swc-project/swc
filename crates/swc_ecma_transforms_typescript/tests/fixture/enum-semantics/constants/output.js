(function(N) {
    (function(Inner) {
        Inner.x = 40;
        Inner.y = Inner.x + 2;
        Inner.annotated = 9;
    })(N.Inner || (N.Inner = {}));
    N.Y = N.Inner.y;
    N.Z = N.Y;
})(N || (N = {}));
const Inner = N.Inner;
const X = Inner.x;
const seed = X + 2;
var Values = function(Values) {
    Values[Values["A"] = 42] = "A";
    Values[Values["B"] = 43] = "B";
    Values[Values["C"] = 42] = "C";
    Values[Values["D"] = 42] = "D";
    Values[Values["E"] = Inner.annotated] = "E";
    Values["S"] = "value=42";
    return Values;
}(Values || {});
const result = [
    42,
    43,
    42,
    42,
    Values.E,
    "value=42"
];
var N;
