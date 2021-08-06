var a = "b" + "c" + d() + "e" + "b" + f() + "d" + "f" + "g" + h();
var i = "b" + 1 + d() + 2 + "j";
var k = 3 + d() + 4 + "j";
// this CAN'T safely be shortened to 1 + x() + "5boo"
var l = 5 + d() + 6 + 7 + "j";
var m = 8 + d() + 9 + "n" + 10 + "j";
