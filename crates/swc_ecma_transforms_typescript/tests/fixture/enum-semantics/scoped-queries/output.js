function first() {
    return 11;
}
function second() {
    return 13;
}
function third() {
    return 17;
}
function fourth() {
    return 19;
}
function fifth() {
    return 23;
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
export const results = [
    1,
    2,
    3,
    4,
    5,
    6,
    first(),
    second(),
    third(),
    fourth(),
    fifth(),
    29,
    31
];
var Values;
