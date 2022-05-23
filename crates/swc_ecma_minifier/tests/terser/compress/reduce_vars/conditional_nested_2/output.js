var c = 0;
(function (a) {
    function f() {
        a && c++;
    }
    f(!c && f(), (a = 1));
})();
console.log(c);
