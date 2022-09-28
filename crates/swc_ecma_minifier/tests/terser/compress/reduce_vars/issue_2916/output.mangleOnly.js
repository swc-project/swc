var n = "FAIL";
(function(o) {
    (function(n) {
        n[0] = 1;
    })(o);
    +o && (n = "PASS");
})([]);
console.log(n);
