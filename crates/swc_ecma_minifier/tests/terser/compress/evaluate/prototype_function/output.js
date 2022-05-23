var a = { valueOf: 0 } < 1;
var b = { toString: 0 } < 1;
var c = { valueOf: 0 } + "";
var d = { toString: 0 } + "";
var e = ({ valueOf: 0 } + "")[2];
var f = ({ toString: 0 } + "")[2];
var g = 0();
var h = 0();
