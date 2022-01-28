var a = "FAIL";
try {
    throw 1;
} catch (args) {
    var a = "PASS";
}
console.log(a);
