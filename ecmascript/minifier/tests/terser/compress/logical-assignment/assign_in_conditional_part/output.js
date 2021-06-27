var status = "PASS";
var nil = null;
nil &&= console.log((status = "FAIL"));
({ prop: null }.prop &&= console.log((status = "FAIL")));
console.log(status);
