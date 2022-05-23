(function () {
    var idCounter = 0;
    _.uniqueId = function (prefix) {
        var id = ++idCounter + "";
        return prefix ? prefix + id : id;
    };
})();
