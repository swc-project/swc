var c = 0;
(function () {
    while (f());
    function f() {
        var b = ((c = 1 + c), void (c = 1 + c));
        b && b[0];
    }
})();
console.log(c);
