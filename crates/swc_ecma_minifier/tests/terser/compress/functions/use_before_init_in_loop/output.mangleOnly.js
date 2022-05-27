var a = "PASS";
for(var b = 2; --b >= 0;)(function() {
    var b = (function() {
        return 1;
    })(b && (a = "FAIL"));
})();
console.log(a);
