var c = "FAIL";
try {
    throw 1;
} catch (b) {
    var c = "PASS";
}
console.log(c);
