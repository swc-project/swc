!(function(o) {
    try {
        throw 0;
    } catch (o) {
        o = +"foo";
    }
    console.log(o);
})();
