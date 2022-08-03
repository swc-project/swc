var n = 0;
(function() {
    function i() {
        while(c());
    }
    var o = i();
    function c() {
        o && o[n++];
    }
    o = 1;
    c();
})();
console.log(n);
