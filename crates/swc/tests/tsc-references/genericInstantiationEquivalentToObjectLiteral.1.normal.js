//// [genericInstantiationEquivalentToObjectLiteral.ts]
var x;
var y;
x = y;
y = x;
f(x);
f(y);
f2(x);
f2(y);
