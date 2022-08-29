//// [templateStringWithEmptyLiteralPortions.ts]
var a = "";
var b = "".concat(0);
var c = "1".concat(0);
var d = "".concat(0, "2");
var e = "1".concat(0, "2");
var f = "".concat(0, 0);
var g = "1".concat(0, 0);
var h = "".concat(0, "2", 0);
var i = "1".concat(0, "2", 0);
var j = "".concat(0, 0, "3");
var k = "1".concat(0, 0, "3");
var l = "".concat(0, "2", 0, "3");
var m = "1".concat(0, "2", 0, "3");
