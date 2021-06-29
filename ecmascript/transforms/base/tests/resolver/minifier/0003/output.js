var a = "PASS";
try {
    throw "FAIL1";
} catch (a1) {
    var a1 = "FAIL2";
}
console.log(a);
