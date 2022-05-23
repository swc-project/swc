(function () {
    var i;
    for (i in { a: 1, b: 2, c: 3 }) (j = i), console.log(j);
    var j;
})();
