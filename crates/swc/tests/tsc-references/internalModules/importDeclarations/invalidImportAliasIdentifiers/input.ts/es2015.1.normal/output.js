// none of these should work, since non are actually modules
var V = 12;
class C {
}
var E;
(function(E1) {
    E1[E1["Red"] = 0] = "Red";
    E1[E1["Blue"] = 1] = "Blue";
})(E || (E = {
}));
export { };
