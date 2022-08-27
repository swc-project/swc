//// [strictTupleLength.ts]
var t0;
var t1;
var t2;
var arr;
var len0 = t0.length;
var len1 = t1.length;
var len2 = t2.length;
var lena = arr.length;
var t1 = t2; // error
var t2 = t1; // error
var b;
var c = b;
t1 = arr; // error with or without strict
arr = t1; // ok with or without strict
