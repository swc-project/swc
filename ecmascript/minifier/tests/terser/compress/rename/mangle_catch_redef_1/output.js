var a = "PASS";
try {
    throw "FAIL1";
} catch (b) {
    var b = "FAIL2";
}
console.log(a);
