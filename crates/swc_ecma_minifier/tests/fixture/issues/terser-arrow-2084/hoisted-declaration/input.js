var c = 10;
(function () {
    (function (c) {
        c = 1 + c;
        var c = 0;
        f14();
        function f14() { console.log(++c); }
        console.log(c);
    })(-1);
})();
console.log(c);
