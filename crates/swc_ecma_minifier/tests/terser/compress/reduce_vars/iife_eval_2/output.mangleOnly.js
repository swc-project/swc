(function () {
    var x = function n() {
        return n;
    };
    console.log(x() === eval("x"));
})();
