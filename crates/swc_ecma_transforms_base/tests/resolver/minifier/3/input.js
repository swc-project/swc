var a = "PASS";
try {
    throw "FAIL1";
} catch (a) {
    var a = "FAIL2";
}
console.log(a);
