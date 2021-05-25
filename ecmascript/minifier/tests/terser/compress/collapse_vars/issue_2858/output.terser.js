var b;
(function () {
    function f() {
        a++;
    }
    f();
    var c = f();
    var a = void 0;
    c || (b = a);
})();
console.log(b);
