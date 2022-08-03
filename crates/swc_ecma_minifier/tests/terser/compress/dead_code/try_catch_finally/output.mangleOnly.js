var l = 1;
!(function() {
    try {
        if (false) throw x;
    } catch (l) {
        var l = 2;
        console.log("FAIL");
    } finally{
        l = 3;
        console.log("PASS");
    }
})();
try {
    console.log(l);
} finally{}
