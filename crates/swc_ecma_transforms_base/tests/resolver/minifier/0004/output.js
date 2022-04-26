var o__1 = "PASS";
try {
    throw 0;
} catch (o__2) {
    (function() {
        function a__3() {
            o__2 = "FAIL";
        }
        a__3(), a__3();
    })();
}
console.log(o__1);
