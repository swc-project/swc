//// [validEnumAssignments.ts]
var E;
(function(E) {
    E[E["A"] = 0] = "A";
    E[E["B"] = 1] = "B";
})(E || (E = {}));
var n;
var a;
var e;
n = e;
n = E.A;
a = n;
a = e;
a = E.A;
e = e;
e = E.A;
e = E.B;
e = n;
e = null;
e = undefined;
e = 1;
e = 1.;
e = 1.0;
e = -1;
