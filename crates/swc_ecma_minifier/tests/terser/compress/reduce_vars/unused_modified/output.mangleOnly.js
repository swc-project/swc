console.log((function() {
    var n = 1, r = "FAIL";
    if (0 || n--) r = "PASS";
    n = 1;
    return r;
})());
