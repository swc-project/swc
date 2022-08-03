var a = "FAIL";
try {
    throw 1;
} catch (r) {
    a = "PASS";
}
console.log(a);
