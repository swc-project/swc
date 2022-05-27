var a = 0;
(function(c) {
    function b() {
        c && a++;
    }
    b(!a && b(), (c = 1));
})();
console.log(a);
