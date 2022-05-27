"aaaaaaaa";
var c = 1, a = "FAIL";
try {
    throw 1;
} catch (b) {
    try {
        throw 0;
    } catch (d) {
        if (b) a = "PASS";
    }
}
console.log(a);
