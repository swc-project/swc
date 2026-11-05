function first() {
    return 11;
}
function second() {
    return 13;
}
(function(Values) {
    (function(A) {
        A[A["V"] = 29] = "V";
    })(Values.A || (Values.A = {}));
    (function(Child) {
        (function(A) {
            A[A["V"] = 31] = "V";
        })(Child.A || (Child.A = {}));
    })(Values.Child || (Values.Child = {}));
})(Values || (Values = {}));
(function(Left) {
    (function(Values) {
        (function(E) {
            E[E["V"] = 41] = "V";
        })(Values.E || (Values.E = {}));
    })(Left.Values || (Left.Values = {}));
    Left.Alias = Left.Values.E;
    Left.Leaf = Left.Values.E.V;
})(Left || (Left = {}));
(function(Right) {
    (function(Values) {
        (function(E) {
            E[E["V"] = 43] = "V";
        })(Values.E || (Values.E = {}));
    })(Right.Values || (Right.Values = {}));
    Right.Alias = Right.Values.E;
    Right.Leaf = Right.Values.E.V;
})(Right || (Right = {}));
(function(Merged) {
    (function(E) {
        E[E["A"] = 47] = "A";
    })(Merged.E || (Merged.E = {}));
    Merged.first = 47;
})(Merged || (Merged = {}));
(function(Merged) {
    (function(E) {
        E[E["B"] = 53] = "B";
    })(Merged.E || (Merged.E = {}));
    Merged.second = 53;
})(Merged || (Merged = {}));
export const results = [
    1,
    first(),
    second(),
    29,
    31,
    41,
    41,
    41,
    Reflect.get(Left.Alias, "V"),
    43,
    43,
    43,
    Reflect.get(Right.Alias, "V"),
    Merged.first,
    Merged.second,
    47,
    53
];
var Values, Left, Right, Merged;
