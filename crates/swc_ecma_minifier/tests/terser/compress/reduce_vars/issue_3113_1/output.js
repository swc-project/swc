var c = 0;
(function() {
    var a = function() {
        while(g());
    }();
    function g() {
        a && a[c++];
    }
    g(a = 1);
})();
console.log(c);
