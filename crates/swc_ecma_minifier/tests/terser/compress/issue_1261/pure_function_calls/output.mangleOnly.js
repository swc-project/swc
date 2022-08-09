(function() {
    console.log("iife0");
})();
var n = (function() {
    console.log("iife1");
    function n() {}
    return n;
})();
(function() {
    var n = (function() {
        console.log("iife2");
        function n() {}
        return n;
    })();
})();
bar(), baz(), quux();
a.b(), c.d.e(), f.g();
