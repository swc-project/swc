!(function(o) {
    try {
        throw 0;
    } catch (t) {
        o = +"foo";
    }
    console.log(o);
})();
