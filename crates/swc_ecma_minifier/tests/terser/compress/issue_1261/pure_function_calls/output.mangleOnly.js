(function() {
    console.log("iife0");
})();
var b = (function() {
    console.log("iife1");
    function b() {}
    return b;
})();
(function() {
    var b = (function() {
        console.log("iife2");
        function b() {}
        return b;
    })();
})();
bar(), baz(), quux();
a.b(), c.d.e(), f.g();
