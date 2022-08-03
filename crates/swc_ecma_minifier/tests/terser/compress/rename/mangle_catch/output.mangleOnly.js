var r = "FAIL";
try {
    throw 1;
} catch (t) {
    r = "PASS";
}
console.log(r);
