console.log((function() {
    var a = {
        a: "PASS"
    }, n = a.a;
    a.a = "FAIL";
    return n;
})());
