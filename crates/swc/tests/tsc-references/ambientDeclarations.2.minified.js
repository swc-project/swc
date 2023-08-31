//// [ambientDeclarations.ts]
// Ambient variable without type annotation
var // Ambient enum
E1, // Ambient enum with integer literal initializer
E2, // Ambient enum members are always exported with or without export keyword
E3, E11, E21, E31;
(E11 = E1 || (E1 = {}))[E11.x = 0] = "x", E11[E11.y = 1] = "y", E11[E11.z = 2] = "z", (E21 = E2 || (E2 = {}))[E21.q = 0] = "q", E21[E21.a = 1] = "a", E21[E21.b = 2] = "b", E21[E21.c = 2] = "c", E21[E21.d = 3] = "d", (E31 = E3 || (E3 = {}))[E31.A = 0] = "A", E3.B, M1.x, M1.fn();
