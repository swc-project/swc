export var E1;
(function(E11) {
    E11[E11["A"] = 0] = "A";
    E11[E11["B"] = 1] = "B";
    E11[E11["C"] = 2] = "C";
})(E1 || (E1 = {
}));
// @Filename: foo_1.ts
var foo = require("./foo_0");
if (foo.E1.A === 0) {
// Should cause runtime import - interesting optimization possibility, as gets inlined to 0.
}
