var n = 0;
(function () {
    function o() {
        while (i());
    }
    var c;
    function i() {
        c && c[n++];
    }
    i((c = 1));
})();
console.log(n);
