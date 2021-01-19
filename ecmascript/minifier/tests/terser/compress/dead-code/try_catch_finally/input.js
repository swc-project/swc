var a = 1;
!(function () {
    try {
        if (false) throw x;
    } catch (a) {
        var a = 2;
        console.log("FAIL");
    } finally {
        a = 3;
        console.log("PASS");
    }
})();
try {
    console.log(a);
} finally {
}
