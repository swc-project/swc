!(function () {
    try {
        var o = 1;
        throw "";
        var c = 2;
    } catch (o) {}
    console.log(o, c);
})();
