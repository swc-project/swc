var or = "PASS";
var null_coalesce = "PASS";
var and = "FAIL";
or ||= "FAIL";
null_coalesce ??= "FAIL";
and &&= "PASS";
console.log(or, null_coalesce, and);
