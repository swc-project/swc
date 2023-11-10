//// [functionLiterals.ts]
var b, c, b2, c2;
b.func1 = b.func2, b.func1 = b.func3, b.func2 = b.func1, b.func2 = b.func3, b.func3 = b.func1, b.func3 = b.func2, c.func4 = c.func5, c.func5 = c.func4, b2.func1 = b2.func2, b2.func1 = b2.func3, b2.func2 = b2.func1, b2.func2 = b2.func3, b2.func3 = b2.func1, b2.func3 = b2.func2, c2.func4 = c2.func5, c2.func5 = c2.func4;
