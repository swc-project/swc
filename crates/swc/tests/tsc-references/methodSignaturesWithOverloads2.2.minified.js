//// [methodSignaturesWithOverloads2.ts]
// Object type literals permit overloads with optionality but they must match
var c, c2;
// no errors
c.func4 = c.func5, c.func5 = c.func4, // no errors
c2.func4 = c2.func5, c2.func5 = c2.func4;
