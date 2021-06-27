(function () {
    var i,
        o = {};
    function createFn(j) {
        return function () {
            console.log(j);
        };
    }
    for (i in { a: 1, b: 2, c: 3 }) o[i] = createFn(i);
    for (i in o) o[i]();
})();
