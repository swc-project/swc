var a = "PASS";
try {
    throw "FAIL1";
} catch (a) {
    var b = "FAIL2";
}
console.log(a);
