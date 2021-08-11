var status = "PASS";
var nil = null;
var nil_prop = { prop: null };
nil &&= console.log((status = "FAIL"));
nil_prop.prop &&= console.log((status = "FAIL"));
console.log(status);
