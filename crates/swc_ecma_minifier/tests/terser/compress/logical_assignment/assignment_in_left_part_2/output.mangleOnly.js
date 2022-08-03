var S = "FAIL";
var a = {
    PASS: false
};
a[(S = id("PASS"))] ||= "PASS";
console.log(S, a.PASS);
