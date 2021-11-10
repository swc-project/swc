var a = "FAIL";
try {
    throw 1;
} catch (o) {
    var a = "PASS";
}
console.log(a);
