var o = "FAIL";
try {
    throw 1;
} catch (r) {
    o = "PASS";
}
console.log(o);
