var c = "FAIL";
(function(b) {
    var d;
    b[0] = 1;
    +b && (c = "PASS");
})([]);
console.log(c);
