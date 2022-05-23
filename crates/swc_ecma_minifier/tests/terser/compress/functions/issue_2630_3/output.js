var x = 2,
    a = 1;
(function () {
    (function f1(a) {
        f2();
        --x >= 0 && f1({});
    })(a++);
    function f2() {
        a++;
    }
})();
console.log(a);
