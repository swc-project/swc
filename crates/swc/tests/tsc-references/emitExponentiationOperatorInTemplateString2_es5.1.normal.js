import _type_of from "@swc/helpers/src/_type_of.mjs";
// @target: es5
var t1 = 10;
var t2 = 10;
var s;
// With templateHead
"hello ".concat(Math.pow(t1, t2));
"hello ".concat(Math.pow(t1, Math.pow(t2, t1)));
"hello ".concat(t1 + Math.pow(t2, t1));
"hello ".concat(Math.pow(t1, t2) + t1);
"hello ".concat(t1 + Math.pow(t2, t2) + t1);
"hello ".concat(_type_of(Math.pow(t1, Math.pow(t2, t1))));
"hello ".concat(1 + _type_of(Math.pow(t1, Math.pow(t2, t1))));
"hello ".concat(Math.pow(t1, t2)).concat(Math.pow(t1, t2));
"hello ".concat(Math.pow(t1, Math.pow(t2, t1))).concat(Math.pow(t1, Math.pow(t2, t1)));
"hello ".concat(t1 + Math.pow(t2, t1)).concat(t1 + Math.pow(t2, t1));
"hello ".concat(Math.pow(t1, t2) + t1).concat(Math.pow(t1, t2) + t1);
"hello ".concat(t1 + Math.pow(t2, t2) + t1).concat(t1 + Math.pow(t2, t2) + t1);
"hello ".concat(_type_of(Math.pow(t1, Math.pow(t2, t1)))).concat(_type_of(Math.pow(t1, Math.pow(t2, t1))));
"hello ".concat(Math.pow(t1, t2), " hello world ").concat(Math.pow(t1, t2));
"hello ".concat(Math.pow(t1, Math.pow(t2, t1)), " hello world ").concat(Math.pow(t1, Math.pow(t2, t1)));
"hello ".concat(t1 + Math.pow(t2, t1), " hello world ").concat(t1 + Math.pow(t2, t1));
"hello ".concat(Math.pow(t1, t2) + t1, " hello world ").concat(Math.pow(t1, t2) + t1);
"hello ".concat(t1 + Math.pow(t2, t2) + t1, " hello world ").concat(t1 + Math.pow(t2, t2) + t1);
"hello ".concat(_type_of(Math.pow(t1, Math.pow(t2, t1))), " hello world ").concat(_type_of(Math.pow(t1, Math.pow(t2, t1))));
