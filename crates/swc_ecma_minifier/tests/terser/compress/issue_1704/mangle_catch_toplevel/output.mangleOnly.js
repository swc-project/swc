var o = "FAIL";
try {
    throw 1;
} catch (o) {
    o = "PASS";
}
console.log(o);
