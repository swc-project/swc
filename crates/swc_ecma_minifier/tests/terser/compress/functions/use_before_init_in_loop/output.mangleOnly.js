var r = "PASS";
for(var n = 2; --n >= 0;)(function() {
    var n = (function() {
        return 1;
    })(n && (r = "FAIL"));
})();
console.log(r);
