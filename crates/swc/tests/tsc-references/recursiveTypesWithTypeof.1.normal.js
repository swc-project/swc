//// [recursiveTypesWithTypeof.ts]
// The following are errors because of circular references
var c;
var c;
var d;
var d;
var e;
var e;
var f;
var f;
var f2;
var f2;
var f3;
var f3;
// None of these declarations should have any errors!
// Truly recursive types
var g;
var g;
var h;
var h = h();
var i;
var i = i(i);
var j;
var j = j(j);
// Same as h, i, j with construct signatures
var h2;
var h2 = new h2();
var i2;
var i2 = new i2(i2);
var j2;
var j2 = new j2(j2);
// Indexers
var k;
var k = k[0];
var k = k[''];
// Hybrid - contains type literals as well as type arguments
// These two are recursive
var hy1;
var hy1 = hy1[0].x;
var hy2;
var hy2 = hy2.x[0];
// This one should be an error because the first type argument is not contained inside a type literal
var hy3;
var hy3;
