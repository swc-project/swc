const a = "32";
!(function () {
    var b = a + 1;
    !(function (a) {
        console.log(b, a++);
    })(0);
})();
