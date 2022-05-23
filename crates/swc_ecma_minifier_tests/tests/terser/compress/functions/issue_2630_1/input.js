var c = 0;
(function () {
    while (f());
    function f() {
        var a = (function () {
            var b = c++,
                d = (c = 1 + c);
        })();
    }
})();
console.log(c);
