(function () {
    console.log("iife0");
})();
var iife1 = (function () {
    console.log("iife1");
    function iife1() {}
    return iife1;
})();
(function () {
    var iife2 = (function () {
        console.log("iife2");
        function iife2() {}
        return iife2;
    })();
})();
var MyClass = (function () {
    function MyClass() {}
    MyClass.prototype.method = function () {};
    return MyClass;
})();
bar(), baz(), quux();
a.b(), c.d.e(), f.g();
