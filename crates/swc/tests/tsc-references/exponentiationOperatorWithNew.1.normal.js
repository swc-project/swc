//// [exponentiationOperatorWithNew.ts]
var a;
var b;
var c;
Math.pow(new a, Math.pow(b, c));
Math.pow(new a, Math.pow(new b, c));
new (Math.pow(a, Math.pow(b, c)));
