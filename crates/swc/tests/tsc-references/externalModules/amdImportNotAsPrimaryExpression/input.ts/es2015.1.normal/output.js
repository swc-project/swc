// @module: amd
// @Filename: foo_0.ts
export class C1 {
    constructor(){
        this.m1 = 42;
    }
}
C1.s1 = true;
export var E1;
(function(E11) {
    E11[E11["A"] = 0] = "A";
    E11[E11["B"] = 1] = "B";
    E11[E11["C"] = 2] = "C";
})(E1 || (E1 = {
}));
// @Filename: foo_1.ts
const foo = require("./foo_0");
var i;
var x = {
};
var y = false;
var z;
var e = 0;
