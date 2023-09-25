//// [additionOperatorWithNullValueAndValidOperator.ts]
// If one operand is the null or undefined value, it is treated as having the type of the other operand.
var E, E1;
(E1 = E || (E = {}))[E1.a = 0] = "a", E1[E1.b = 1] = "b", E1[E1.c = 2] = "c";
