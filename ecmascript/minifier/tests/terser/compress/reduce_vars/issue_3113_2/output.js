var c = 0;
(function () {
    function f() {
        while (g());
    }
    var a = f();
    function g() {
        a && a[c++];
    }
    a = 1;
    g();
})();
console.log(c);
