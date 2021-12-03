var // @target: es5
E1;
(function(E11) {
    E11[E11["x"] = 0] = "x";
})(E1 || (E1 = {
}));
var E2;
(function(E21) {
    E21[E21["x"] = 0] = "x";
})(E2 || (E2 = {
}));
var o = {
    [E1.x || E2.x]: 0
};
