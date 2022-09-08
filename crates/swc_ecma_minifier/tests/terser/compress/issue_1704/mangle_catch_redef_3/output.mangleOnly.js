var o = "PASS";
try {
    throw 0;
} catch (c) {
    (function() {
        function o() {
            c = "FAIL";
        }
        o(), o();
    })();
}
console.log(o);
