var n = 0;
(function() {
    function i() {
        while(c());
    }
    var o;
    function c() {
        o && o[n++];
    }
    c((o = 1));
})();
console.log(n);
