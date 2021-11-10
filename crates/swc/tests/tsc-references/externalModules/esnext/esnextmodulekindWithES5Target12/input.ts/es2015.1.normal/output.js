class C1 {
}
// @target: es5
// @module: esnext
export { C1 as C };
(function(C) {
    C.x = 1;
})(C1 || (C1 = {
}));
var E1;
export { E1 as E };
(function(E) {
    E[E["w"] = 1] = "w";
})(E1 || (E1 = {
}));
(function(E) {
    E[E["x"] = 2] = "x";
})(E1 || (E1 = {
}));
(function(E) {
    E.y = 1;
})(E1 || (E1 = {
}));
(function(E) {
    E.z = 1;
})(E1 || (E1 = {
}));
(function(N) {
    N.x = 1;
})(N || (N = {
}));
function F1() {
}
export { F1 as F };
(function(F) {
    F.x = 1;
})(F1 || (F1 = {
}));
