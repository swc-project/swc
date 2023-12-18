var o = "PASS";
try {
    throw 0;
} catch (o) {
    (function() {
        function o() {
            o = "FAIL";
        }
        o(), o();
    })();
}
console.log(o);
