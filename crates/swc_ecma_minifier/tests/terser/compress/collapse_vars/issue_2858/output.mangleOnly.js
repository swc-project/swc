var o;
(function() {
    function o() {
        v++;
    }
    o();
    var n = o();
    var v = void 0;
    n || (o = v);
})();
console.log(o);
