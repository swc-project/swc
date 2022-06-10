console.log((function() {
    var a = 1, b = "FAIL";
    if (0 || a--) b = "PASS";
    a = 1;
    return b;
})());
