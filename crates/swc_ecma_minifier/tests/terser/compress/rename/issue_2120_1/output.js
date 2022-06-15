"aaaaaaaa";
var a = 1, b = "FAIL";
try {
    throw 1;
} catch (a) {
    try {
        throw 0;
    } catch (b) {
        if (a) b = "PASS";
    }
}
console.log(b);
