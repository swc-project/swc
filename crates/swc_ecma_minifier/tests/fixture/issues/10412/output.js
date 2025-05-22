!function(e, i) {
    // "_" rename to another name also reproduce
    var _ = ((i = {})[n.NONE] = {
        platform: a.NONE
    }, i);
    e.getPlatform = function() {
        // "_" should not be removed
        console.log(_[t.toString()]);
    };
}();
