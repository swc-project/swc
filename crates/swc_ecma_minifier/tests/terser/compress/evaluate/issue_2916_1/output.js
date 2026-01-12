var c = "PASS";
(function(b) {
    (function(d) {
        d[0] = 1;
    })(b);
    "" == b && (c = "FAIL");
})([]);
console.log(c);
