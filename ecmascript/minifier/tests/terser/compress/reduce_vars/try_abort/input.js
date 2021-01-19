!(function () {
    try {
        var a = 1;
        throw "";
        var b = 2;
    } catch (e) {}
    console.log(a, b);
})();
