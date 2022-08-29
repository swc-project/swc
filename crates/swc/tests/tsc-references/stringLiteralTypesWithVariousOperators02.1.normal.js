//// [stringLiteralTypesWithVariousOperators02.ts]
var abc = "ABC";
var xyz = "XYZ";
var abcOrXyz = abc || xyz;
var abcOrXyzOrNumber = abcOrXyz || 100;
var a = abcOrXyzOrNumber + 100;
var b = 100 + abcOrXyzOrNumber;
var c = abcOrXyzOrNumber + abcOrXyzOrNumber;
var d = abcOrXyzOrNumber + true;
var e = false + abcOrXyzOrNumber;
var f = abcOrXyzOrNumber++;
var g = --abcOrXyzOrNumber;
var h = abcOrXyzOrNumber ^ 10;
var i = abcOrXyzOrNumber | 10;
var j = abc < xyz;
var k = abc === xyz;
var l = abc != xyz;
