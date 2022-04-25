(function (obj) {
    var i,
        foo = 5;
    for (i in obj) return foo;
})();
