"aaaaaaaa";
var a = 1, t = "FAIL";
try {
    throw 1;
} catch (r) {
    try {
        throw 0;
    } catch (c) {
        if (r) t = "PASS";
    }
}
console.log(t);
