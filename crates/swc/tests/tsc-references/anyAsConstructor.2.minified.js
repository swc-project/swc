//// [anyAsConstructor.ts]
var x;
new (void 0)(), new x("hello"), new x(x), new x(x);
