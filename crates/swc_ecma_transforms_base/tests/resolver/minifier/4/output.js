var o__2 = "PASS";
try {
    throw 0;
} catch (o__4) {
    (function() {
        function a__5() {
            o__4 = "FAIL";
        }
        a__5(), a__5();
    })();
}
console.log(o__2);
