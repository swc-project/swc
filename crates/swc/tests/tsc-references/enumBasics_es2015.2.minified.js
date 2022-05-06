!function(E1) {
    E1[E1.A = 0] = "A", E1[E1.B = 1] = "B", E1[E1.C = 2] = "C";
}(E1 || (E1 = {})), E1.A;
var E1, e, E2, E3, E4, E5, E6, E7, E8, E9, e = E1;
E1[e.A], function(E2) {
    E2[E2.A = 1] = "A", E2[E2.B = 2] = "B", E2[E2.C = 3] = "C";
}(E2 || (E2 = {})), function(E3) {
    E3[E3.X = 3] = "X", E3[E3.Y = 7] = "Y", E3[E3.Z = NaN] = "Z";
}(E3 || (E3 = {})), function(E4) {
    E4[E4.X = 0] = "X", E4[E4.Y = 1] = "Y", E4[E4.Z = 3] = "Z";
}(E4 || (E4 = {})), function(E5) {
    E5[E5.A = 0] = "A", E5[E5.B = 3] = "B", E5[E5.C = 4] = "C";
}(E5 || (E5 = {})), function(E6) {
    E6[E6.A = 0] = "A", E6[E6.B = 0] = "B", E6[E6.C = 1] = "C";
}(E6 || (E6 = {})), function(E7) {
    E7[E7.A = 'foo'.foo] = "A";
}(E7 || (E7 = {})), function(E8) {
    E8[E8.B = 'foo'.foo] = "B";
}(E8 || (E8 = {})), function(E9) {
    E9[E9.A = 0] = "A", E9[E9.B = 0] = "B";
}(E9 || (E9 = {})), E8.B, E7.A, E4.Z, E3.X, E3.Y, E3.Z, E9.A, E9.B, E6.B, E6.C, E6.A, E5.A, E5.B, E5.C;
