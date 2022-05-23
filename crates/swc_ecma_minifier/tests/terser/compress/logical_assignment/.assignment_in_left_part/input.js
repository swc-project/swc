var status = "FAIL";
var x = {};
x[(status = "PASS")] ||= 1;
console.log(status);
