var a = "FAIL",
    b;
while (((a = "PASS"), --b) && "PASS" == b);
console.log(a, b);
