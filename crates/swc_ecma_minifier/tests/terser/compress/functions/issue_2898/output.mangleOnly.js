var o = 0;
(function () {
    while (n());
    function n() {
        var n = ((o = 1 + o), void (o = 1 + o));
        n && n[0];
    }
})();
console.log(o);
