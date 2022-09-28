var o = "FAIL";
try {
    throw 1;
} catch (c) {
    o = "PASS";
}
console.log(o);
