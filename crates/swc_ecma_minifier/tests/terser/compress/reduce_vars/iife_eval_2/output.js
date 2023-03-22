(function() {
    var x = function f1() {
        return f1;
    };
    console.log(x() === eval("x"));
})();
