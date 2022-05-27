var a = "FAIL";
(function(b) {
    (function(a) {
        a[0] = 1;
    })(b);
    +b && (a = "PASS");
})([]);
console.log(a);
