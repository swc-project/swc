var c = "FAIL";
(function (b) {
    b[0] = 1;
    +b && (c = "PASS");
})([]);
console.log(c);
