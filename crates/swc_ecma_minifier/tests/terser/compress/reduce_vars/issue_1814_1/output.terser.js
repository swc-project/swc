const a = 42;
!(function () {
    !(function (a) {
        console.log(a++, 42);
    })(0);
})();
