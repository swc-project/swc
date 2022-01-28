var a = "FAIL";
try {
    throw 1;
} catch (b) {
    var a = "PASS";
}
console.log(a);
