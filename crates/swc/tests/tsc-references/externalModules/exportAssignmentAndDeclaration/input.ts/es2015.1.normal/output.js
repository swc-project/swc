export var E1;
(function(E11) {
    E11[E11["A"] = 0] = "A";
    E11[E11["B"] = 1] = "B";
    E11[E11["C"] = 2] = "C";
})(E1 || (E1 = {
}));
class C1 {
}
// Invalid, as there is already an exported member.
module.exports = C1;
