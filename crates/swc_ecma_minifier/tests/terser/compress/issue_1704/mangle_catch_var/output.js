var a = "FAIL";
try {
    throw 1;
} catch (r) {
    var a = "PASS";
}
console.log(a);
