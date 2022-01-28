const a = 42;
!(function () {
    var b = a;
    !(function (a) {
        console.log(a++, b);
    })(0);
})();
