var o = "FAIL";
try {
    throw 1;
} catch (o) {
    var o = "PASS";
}
console.log(o);
