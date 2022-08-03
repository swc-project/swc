"aaaaaaaa";
var a = 1, b = "FAIL";
try {
    throw 1;
} catch (t) {
    try {
        throw 0;
    } catch (r) {
        if (t) b = "PASS";
    }
}
console.log(b);
