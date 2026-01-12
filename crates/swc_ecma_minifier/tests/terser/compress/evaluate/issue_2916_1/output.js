var c = "PASS";
(function(a, b) {
    (function(d) {
        d[0] = 1;
    })(b);
    "" == b && (c = "FAIL");
})(0, []);
console.log(c);
