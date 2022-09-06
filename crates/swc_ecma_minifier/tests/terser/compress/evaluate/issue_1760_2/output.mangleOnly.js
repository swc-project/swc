!(function (o) {
    try {
        throw 0;
    } catch (c) {
        o = 123456789 / 0;
    }
    console.log(o);
})();
