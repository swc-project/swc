var n = 0;
(function () {
    function o() {
        while (i());
    }
    var c = o();
    function i() {
        c && c[n++];
    }
    c = 1;
    i();
})();
console.log(n);
