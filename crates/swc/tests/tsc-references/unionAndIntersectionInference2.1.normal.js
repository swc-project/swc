//// [unionAndIntersectionInference2.ts]
var a1;
var b1;
var c1;
var d1;
var e1;
f1(a1); // string
f1(b1); // string[]
f1(c1); // string[]
f1(d1); // { name: string }
f1(e1); // number | boolean
var a2;
var b2;
var c2;
var d2;
f2(a2); // string
f2(b2); // string[]
f2(c2); // never
f2(d2); // never
