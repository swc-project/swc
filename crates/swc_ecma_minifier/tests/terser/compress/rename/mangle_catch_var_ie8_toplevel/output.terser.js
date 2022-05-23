var o = "FAIL";
try {
    throw 1;
} catch (r) {
    var o = "PASS";
}
console.log(o);
