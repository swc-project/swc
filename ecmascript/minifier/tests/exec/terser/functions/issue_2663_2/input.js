(function () {
    var i;
    function fn(j) {
        return (function () {
            console.log(j);
        })();
    }
    for (i in { a: 1, b: 2, c: 3 }) fn(i);
})();
