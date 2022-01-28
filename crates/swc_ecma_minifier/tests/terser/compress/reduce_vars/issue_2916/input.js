var c = "FAIL";
(function (b) {
    (function (d) {
        d[0] = 1;
    })(b);
    +b && (c = "PASS");
})([]);
console.log(c);
