var n = "PASS";
for(var o = 2; --o >= 0;)(function() {
    var n = (function() {
        return 1;
    })(n && (n = "FAIL"));
})();
console.log(n);
