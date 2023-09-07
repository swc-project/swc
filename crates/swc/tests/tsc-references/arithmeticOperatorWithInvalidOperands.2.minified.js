//// [arithmeticOperatorWithInvalidOperands.ts]
// these operators require their operands to be of type Any, the Number primitive type, or
// an enum type
var E, E1;
(E1 = E || (E = {}))[E1.a = 0] = "a", E1[E1.b = 1] = "b", E1[E1.c = 2] = "c";
