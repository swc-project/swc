!(function () {
    var n = 1,
        o = 0;
    !(function () {
        o++;
        return;
        n = 2;
    })();
    console.log(n);
})();
