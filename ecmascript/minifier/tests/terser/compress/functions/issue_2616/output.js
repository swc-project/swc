var c = "FAIL";
!(function (NaN) {
    (true << NaN) - 0 / 0 || (c = "PASS");
})([]);
console.log(c);
