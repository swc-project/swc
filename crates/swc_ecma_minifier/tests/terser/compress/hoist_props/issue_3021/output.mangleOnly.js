var r = 1, n = 2;
(function() {
    n = r;
    if (r++ + n--) return 1;
    return;
    var n = {};
})();
console.log(r, n);
