var o = "PASS";
var l = null;
var p = { prop: null };
l &&= console.log((o = "FAIL"));
p.prop &&= console.log((o = "FAIL"));
console.log(o, l, p.prop);
