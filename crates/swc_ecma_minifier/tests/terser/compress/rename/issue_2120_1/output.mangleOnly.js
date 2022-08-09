"aaaaaaaa";
var t = 1, r = "FAIL";
try {
    throw 1;
} catch (c) {
    try {
        throw 0;
    } catch (h) {
        if (c) r = "PASS";
    }
}
console.log(r);
