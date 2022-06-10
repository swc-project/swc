var a = "FAIL";
var b = {
    PASS: false
};
b[(a = id("PASS"))] ||= "PASS";
console.log(a, b.PASS);
