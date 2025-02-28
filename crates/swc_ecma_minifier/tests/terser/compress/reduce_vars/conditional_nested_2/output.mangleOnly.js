var n = 0;
(function(c) {
    function o() {
        c && n++;
    }
    o(!n && o(), (c = 1));
})();
console.log(n);
