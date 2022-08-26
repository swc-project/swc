var S = "FAIL";
var A = {
    PASS: false
};
A[(S = id("PASS"))] ||= "PASS";
console.log(S, A.PASS);
