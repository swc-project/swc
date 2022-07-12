// @declaration: true
// An enum declaration that specifies a const modifier is a constant enum declaration.
// In a constant enum declaration, all members must have constant values and
// it is an error for a member declaration to specify an expression that isn't classified as a constant enum expression.
var E;
(function(E) {
    E[E["a"] = 10] = "a";
    E[E["b"] = 10] = "b";
    E[E["c"] = 11] = "c";
    E[E["e"] = 12] = "e";
    E[E["d"] = -13] = "d";
    E[E["f"] = 20] = "f";
    E[E["g"] = 20] = "g";
    E[E["h"] = 10] = "h";
})(E || (E = {}));
