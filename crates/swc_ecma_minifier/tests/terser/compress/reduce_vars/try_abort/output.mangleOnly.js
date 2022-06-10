!(function() {
    try {
        var a = 1;
        throw "";
        var b = 2;
    } catch (c) {}
    console.log(a, b);
})();
