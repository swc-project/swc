var e = (function(e) {
    function e() {
        console.log("Value after override");
    }
    return e;
})("Value before override");
e();
