// @strict
var E;
(function(E) {
    E[E["A"] = 0] = "A";
    E[E["B"] = 1] = "B";
    E[E["C"] = 2] = "C";
    E[E["D"] = 3] = "D";
    E[E["E"] = 4] = "E";
    E[E["F"] = 5] = "F";
})(E || (E = {}));
let x0; // 'a' | 'b' | 'c'
let x1; // 'b' | 'c'
let x2; // 'c'
let x3; // never
let x4; // 'c'
let x5; // never
let y0; // 0 | 1 | 2
let y1; // 1 | 2
let y2; // 2
let y3; // never
let y4; // 2
let y5; // never
let z0; // E.A | E.B | E.C
let z1; // E.B | E.C
let z2; // E.C
let z3; // never
let z4; // E.C
let z5; // never
