console.log((function() {
    var a = {
        a: "PASS"
    }, b = a.a;
    a.a = "FAIL";
    return b;
})());
