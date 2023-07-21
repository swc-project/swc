var a = "PASS";
for(var b = 2; --b >= 0;)(function() {
    var c = (c && (a = "FAIL"), 1);
})();
console.log(a);
