//// [anyAsConstructor.ts]
var x;
new x(), new x('hello'), new x(x), new x(x);
