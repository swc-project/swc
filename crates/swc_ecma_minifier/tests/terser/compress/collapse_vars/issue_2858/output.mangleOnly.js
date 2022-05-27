var a;
(function() {
    function b() {
        d++;
    }
    b();
    var c = b();
    var d = void 0;
    c || (a = d);
})();
console.log(a);
