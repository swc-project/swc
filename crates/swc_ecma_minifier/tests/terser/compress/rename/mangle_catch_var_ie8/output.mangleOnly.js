var r = "FAIL";
try {
    throw 1;
} catch (a) {
    var r = "PASS";
}
console.log(r);
