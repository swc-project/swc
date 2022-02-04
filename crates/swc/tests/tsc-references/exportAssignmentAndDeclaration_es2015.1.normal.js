export var E1;
(function(E1) {
    E1[E1["A"] = 0] = "A";
    E1[E1["B"] = 1] = "B";
    E1[E1["C"] = 2] = "C";
})(E1 || (E1 = {}));
class C1 {
}
// Invalid, as there is already an exported member.
module.exports = C1;
