//// [module.d.ts]
//// [class.d.ts]
//// [test.ts]
var p;
var p = A.Point.Origin;
var p = new A.Point(0, 0); // unexpected error here, bug 840000
