"aaaaaaaa";
var a = 1, t = "FAIL";
try {
    throw 1;
} catch (c) {
    try {
        throw 0;
    } catch (o) {
        if (c) t = "PASS";
    }
}
console.log(t);
