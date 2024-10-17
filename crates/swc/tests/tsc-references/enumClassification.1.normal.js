//// [enumClassification.ts]
// An enum type where each member has no initializer or an initializer that specififes
// a numeric literal, a string literal, or a single identifier naming another member in
// the enum type is classified as a literal enum type. An enum type that doesn't adhere
// to this pattern is classified as a numeric enum type.
// Examples of literal enum types
var E01 = /*#__PURE__*/ function(E01) {
    E01[E01["A"] = 0] = "A";
    return E01;
}(E01 || {});
var E02 = /*#__PURE__*/ function(E02) {
    E02[E02["A"] = 123] = "A";
    return E02;
}(E02 || {});
var E03 = /*#__PURE__*/ function(E03) {
    E03["A"] = "hello";
    return E03;
}(E03 || {});
var E04 = /*#__PURE__*/ function(E04) {
    E04[E04["A"] = 0] = "A";
    E04[E04["B"] = 1] = "B";
    E04[E04["C"] = 2] = "C";
    return E04;
}(E04 || {});
var E05 = /*#__PURE__*/ function(E05) {
    E05[E05["A"] = 0] = "A";
    E05[E05["B"] = 10] = "B";
    E05[E05["C"] = 11] = "C";
    return E05;
}(E05 || {});
var E06 = /*#__PURE__*/ function(E06) {
    E06["A"] = "one";
    E06["B"] = "two";
    E06["C"] = "three";
    return E06;
}(E06 || {});
var E07 = /*#__PURE__*/ function(E07) {
    E07[E07["A"] = 0] = "A";
    E07[E07["B"] = 1] = "B";
    E07["C"] = "hi";
    E07[E07["D"] = 10] = "D";
    E07[E07["E"] = 11] = "E";
    E07["F"] = "bye";
    return E07;
}(E07 || {});
var E08 = /*#__PURE__*/ function(E08) {
    E08[E08["A"] = 10] = "A";
    E08["B"] = "hello";
    E08[E08["C"] = 10] = "C";
    E08["D"] = "hello";
    E08[E08["E"] = 10] = "E";
    return E08;
}(E08 || {});
// Examples of numeric enum types with only constant members
var E10 = /*#__PURE__*/ function(E10) {
    return E10;
}(E10 || {});
var E11 = /*#__PURE__*/ function(E11) {
    E11[E11["A"] = 0] = "A";
    E11[E11["B"] = 1] = "B";
    E11[E11["C"] = 2] = "C";
    return E11;
}(E11 || {});
var E12 = /*#__PURE__*/ function(E12) {
    E12[E12["A"] = 1] = "A";
    E12[E12["B"] = 2] = "B";
    E12[E12["C"] = 4] = "C";
    return E12;
}(E12 || {});
// Examples of numeric enum types with constant and computed members
var E20 = /*#__PURE__*/ function(E20) {
    E20[E20["A"] = "foo".length] = "A";
    E20[E20["B"] = E20.A + 1] = "B";
    E20[E20["C"] = +"123"] = "C";
    E20[E20["D"] = Math.sin(1)] = "D";
    return E20;
}(E20 || {});
