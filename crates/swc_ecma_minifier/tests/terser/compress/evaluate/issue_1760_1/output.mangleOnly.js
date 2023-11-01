!(function(o) {
    try {
        throw 0;
    } catch (NaN) {
        o = +"foo";
    }
    console.log(o);
})();
