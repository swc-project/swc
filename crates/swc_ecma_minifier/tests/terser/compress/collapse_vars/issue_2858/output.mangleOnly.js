var o;
(function () {
    function n() {
        a++;
    }
    n();
    var v = n();
    var a = void 0;
    v || (o = a);
})();
console.log(o);
