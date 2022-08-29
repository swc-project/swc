//// [unionTypeReduction.ts]
var i2, i3;
var e1;
var e2 = i2 || i3; // Type of e2 immediately reduced to I3
var r1 = e1(); // Type of e1 reduced to I3 upon accessing property or signature
var r2 = e2();
