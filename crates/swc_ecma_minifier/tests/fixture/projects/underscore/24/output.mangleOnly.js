(function() {
    var a = 0;
    _.uniqueId = function(b) {
        var c = ++a + "";
        return b ? b + c : c;
    };
})();
