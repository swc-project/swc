!(function(t) {
    try {
        throw 0;
    } catch (c) {
        t = +"foo";
    }
    console.log(t);
})();
