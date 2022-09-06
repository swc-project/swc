"aaaaaaaa";
var a = 1, b = "FAIL";
try {
    throw 1;
} catch (t) {
    try {
        throw 0;
    } catch (c) {
        if (t) b = "PASS";
    }
}
console.log(b);
