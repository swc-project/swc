var a = "FAIL";
try {
    throw 1;
} catch (a) {
    var a = "PASS";
}
console.log(a);
