(function() {
    var n = 0;
    _.uniqueId = function(u) {
        var r = ++n + "";
        return u ? u + r : r;
    };
})();
