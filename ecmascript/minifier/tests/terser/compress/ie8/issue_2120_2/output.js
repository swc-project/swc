"aaaaaaaa";
var a = 1,
    b = "FAIL";
try {
    throw 1;
} catch (c) {
    try {
        throw 0;
    } catch (a) {
        if (c) b = "PASS";
    }
}
console.log(b);
