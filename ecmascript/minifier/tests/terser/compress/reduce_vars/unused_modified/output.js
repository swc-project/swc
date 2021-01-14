console.log(function() {
    var b = 1, c = "FAIL";
    if (b--) c = "PASS";
    b = 1;
    return c;
}());
