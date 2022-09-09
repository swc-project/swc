!(function (o) {
    try {
        throw 0;
    } catch (c) {
        o = +"foo";
    }
    console.log(o);
})();
