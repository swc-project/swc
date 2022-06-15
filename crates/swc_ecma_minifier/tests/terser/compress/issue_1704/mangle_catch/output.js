var a = "FAIL";
try {
    throw 1;
} catch (a) {
    a = "PASS";
}
console.log(a);
