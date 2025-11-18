//// [intersectionTypeOverloading.ts]
// Check that order is preserved in intersection types for purposes of
// overload resolution
var fg;
var gf;
var x = fg("abc");
var x;
var y = gf("abc");
var y;
