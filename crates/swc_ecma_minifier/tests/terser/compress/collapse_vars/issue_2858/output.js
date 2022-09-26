var b;
(function() {
    function f() {
        a++;
    }
    f();
    var a = void 0;
    f() || (b = a);
})();
console.log(b);
