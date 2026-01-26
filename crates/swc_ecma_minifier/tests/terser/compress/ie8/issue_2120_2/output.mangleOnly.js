"aaaaaaaa";
var a = 1, c = "FAIL";
try {
    throw 1;
} catch (a) {
    try {
        throw 0;
    } catch (t) {
        if (a) c = "PASS";
    }
}
console.log(c);
