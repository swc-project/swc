(function() {
    var x = function a() {
        return a;
    };
    console.log(x() === eval("x"));
})();
