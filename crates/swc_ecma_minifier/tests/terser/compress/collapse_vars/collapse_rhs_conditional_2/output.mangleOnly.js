var S = "FAIL",
    l;
while (((S = "PASS"), --l) && "PASS" == l);
console.log(S, l);
