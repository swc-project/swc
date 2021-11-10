var b, a = "FAIL";
while(a = "PASS", --b && "PASS" == b);
console.log(a, b);
