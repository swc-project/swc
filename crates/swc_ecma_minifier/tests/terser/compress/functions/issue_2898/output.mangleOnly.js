var i = 0;
(function() {
    while(n());
    function n() {
        var n = ((i = 1 + i), void (i = 1 + i));
        n && n[0];
    }
})();
console.log(i);
