var a = "FAIL";
try {
    throw 1;
} catch (args) {
    a = "PASS";
}
console.log(a);
