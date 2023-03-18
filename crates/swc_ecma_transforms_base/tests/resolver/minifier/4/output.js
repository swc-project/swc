var o__1 = "PASS";
try {
    throw 0;
} catch (o__3) {
    (function() {
        function a__4() {
            o__3 = "FAIL";
        }
        a__4(), a__4();
    })();
}
console.log(o__1);
