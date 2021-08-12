var c = 0;
(function () {
    function f() {
        while (g());
    }
    var a = f();
    function g() {
        a && a[c++];
    }
    g((a = 1));
})();
console.log(c);
