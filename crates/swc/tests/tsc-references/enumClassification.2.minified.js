//// [enumClassification.ts]
var E01, E02, E03, E04, E05, E06, E07, E08, E10, E11, E12, E20;
!function(E01) {
    E01[E01.A = 0] = "A";
}(E01 || (E01 = {})), function(E02) {
    E02[E02.A = 123] = "A";
}(E02 || (E02 = {})), (E03 || (E03 = {})).A = "hello", function(E04) {
    E04[E04.A = 0] = "A", E04[E04.B = 1] = "B", E04[E04.C = 2] = "C";
}(E04 || (E04 = {})), function(E05) {
    E05[E05.A = 0] = "A", E05[E05.B = 10] = "B", E05[E05.C = 11] = "C";
}(E05 || (E05 = {})), function(E06) {
    E06.A = "one", E06.B = "two", E06.C = "three";
}(E06 || (E06 = {})), function(E07) {
    E07[E07.A = 0] = "A", E07[E07.B = 1] = "B", E07.C = "hi", E07[E07.D = 10] = "D", E07[E07.E = 11] = "E", E07.F = "bye";
}(E07 || (E07 = {})), function(E08) {
    E08[E08.A = 10] = "A", E08.B = "hello", E08[E08.C = 10] = "C", E08.D = "hello", E08[E08.E = 10] = "E";
}(E08 || (E08 = {})), E10 || (E10 = {}), function(E11) {
    E11[E11.A = 0] = "A", E11[E11.B = 1] = "B", E11[E11.C = 2] = "C";
}(E11 || (E11 = {})), function(E12) {
    E12[E12.A = 1] = "A", E12[E12.B = 2] = "B", E12[E12.C = 4] = "C";
}(E12 || (E12 = {})), function(E20) {
    E20[E20.A = 3] = "A", E20[E20.B = E20.A + 1] = "B", E20[E20.C = 123] = "C", E20[E20.D = 0.8414709848078965] = "D";
}(E20 || (E20 = {}));
