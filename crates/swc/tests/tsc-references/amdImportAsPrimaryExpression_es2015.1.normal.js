// @module: amd
// @Filename: foo_0.ts
export var E1;
(function(E1) {
    E1[E1["A"] = 0] = "A";
    E1[E1["B"] = 1] = "B";
    E1[E1["C"] = 2] = "C";
})(E1 || (E1 = {}));
// @Filename: foo_1.ts
const foo = require("./foo_0");
if (foo.E1.A === 0) {
// Should cause runtime import - interesting optimization possibility, as gets inlined to 0.
}
export { };
