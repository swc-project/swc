//// [constEnum1.ts]
// An enum declaration that specifies a const modifier is a constant enum declaration.
// In a constant enum declaration, all members must have constant values and
// it is an error for a member declaration to specify an expression that isn't classified as a constant enum expression.
var E, E1;
(E1 = E || (E = {}))[E1.a = 10] = "a", E1[E1.b = 10] = "b", E1[E1.c = 11] = "c", E1[E1.e = 12] = "e", E1[E1.d = -13] = "d", E1[E1.f = 20] = "f", E1[E1.g = 20] = "g", E1[E1.h = 10] = "h";
