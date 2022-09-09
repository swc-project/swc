var o = "PASS";
var l = null;
var n = { prop: null };
l &&= console.log((o = "FAIL"));
n.prop &&= console.log((o = "FAIL"));
console.log(o);
