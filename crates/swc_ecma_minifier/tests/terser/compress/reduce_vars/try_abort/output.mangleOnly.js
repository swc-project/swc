!(function() {
    try {
        var r = 1;
        throw "";
        var t = 2;
    } catch (a) {}
    console.log(r, t);
})();
