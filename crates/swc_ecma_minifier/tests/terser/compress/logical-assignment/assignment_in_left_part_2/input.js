var status = "FAIL";
var x = { PASS: false };
x[(status = id("PASS"))] ||= "PASS";
console.log(status, x.PASS);
