//// [unionTypeCallSignatures2.ts]
var f1;
var n1 = f1(42); // number
var s1 = f1("abc"); // boolean | string | number
var a1 = f1([
    true,
    false
]); // boolean[]
var f2;
var n2 = f2(42); // number
var s2 = f2("abc"); // number | string | boolean
var a2 = f2([
    true,
    false
]); // boolean[]
var f3;
var n3 = f3(42); // number
var s3 = f3("abc"); // string | boolean | number
var a3 = f3([
    true,
    false
]); // boolean[]
