var o = "PASS";
try {
    throw 0;
} catch (o1) {
    (function() {
        function a() {
            o1 = "FAIL";
        }
        a(), a();
    })();
}
console.log(o);
