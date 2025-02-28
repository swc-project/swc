"aaaaaaaa";
var t = 1, a = "FAIL";
try {
    throw 1;
} catch (t) {
    try {
        throw 0;
    } catch (c) {
        if (t) a = "PASS";
    }
}
console.log(a);
