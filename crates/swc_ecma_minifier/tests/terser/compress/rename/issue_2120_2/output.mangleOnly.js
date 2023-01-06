"aaaaaaaa";
var a = 1, t = "FAIL";
try {
    throw 1;
} catch (a) {
    try {
        throw 0;
    } catch (c) {
        if (a) t = "PASS";
    }
}
console.log(t);
