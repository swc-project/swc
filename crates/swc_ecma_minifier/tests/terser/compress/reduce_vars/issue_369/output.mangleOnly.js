var n = (function(n) {
    function n() {
        console.log("Value after override");
    }
    return n;
})("Value before override");
n();
