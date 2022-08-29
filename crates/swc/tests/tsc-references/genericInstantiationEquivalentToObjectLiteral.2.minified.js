//// [genericInstantiationEquivalentToObjectLiteral.ts]
var x, y;
y = x = y, f(x), f(y), f2(x), f2(y);
