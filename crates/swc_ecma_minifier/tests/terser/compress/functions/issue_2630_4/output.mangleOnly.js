var n = 3, o = 1, c = 2;
(function() {
    (function o() {
        while(--n >= 0 && c());
    })();
    function c() {
        o++ + (c += o);
    }
})();
console.log(o);
