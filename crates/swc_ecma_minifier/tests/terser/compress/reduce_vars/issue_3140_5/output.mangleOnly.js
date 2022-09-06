var n = 1,
    o = 0;
(function (c) {
    var i = (function () {
        this;
        n-- && t();
    })();
    function t() {
        i && o++;
    }
    t((i = 1));
})();
console.log(o);
