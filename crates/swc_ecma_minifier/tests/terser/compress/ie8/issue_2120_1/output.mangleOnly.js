"aaaaaaaa";
var a = 1, t = "FAIL";
try {
    throw 1;
} catch (o) {
    try {
        throw 0;
    } catch (c) {
        if (o) t = "PASS";
    }
}
console.log(t);
