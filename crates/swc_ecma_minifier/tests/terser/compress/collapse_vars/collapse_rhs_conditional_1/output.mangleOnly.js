var a = "PASS", b = "FAIL";
b = a;
"function" == typeof f && f(a);
console.log(a, b);
