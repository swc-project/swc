var or = null;
var null_coalesce = null;
var and = "FAIL";
or ||= "PASS";
null_coalesce ??= "PASS";
and &&= "PASS";
console.log(or, null_coalesce, and);
