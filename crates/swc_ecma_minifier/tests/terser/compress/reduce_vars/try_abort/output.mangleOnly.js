!(function() {
    try {
        var o = 1;
        throw "";
        var c = 2;
    } catch (r) {}
    console.log(o, c);
})();
