var c = 0;
(function() {
    var a = function() {
        while(g());
    }();
    function g() {
        a && a[c++];
    }
    a = 1;
    g();
})();
console.log(c);
