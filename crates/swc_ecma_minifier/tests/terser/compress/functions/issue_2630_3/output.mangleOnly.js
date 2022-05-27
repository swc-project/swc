var b = 2, a = 1;
(function() {
    function c(a) {
        d();
        --b >= 0 && c({});
    }
    c(a++);
    function d() {
        a++;
    }
})();
console.log(a);
