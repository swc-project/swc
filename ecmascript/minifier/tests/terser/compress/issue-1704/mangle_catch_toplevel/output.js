var a = "FAIL";
try {
    throw 1;
} catch (b) {
    a = "PASS";
}
console.log(a);
