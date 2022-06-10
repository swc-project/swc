var a = "PASS";
for(var b in "12")(function(b) {
    (b >>= 1) && (a = "FAIL"), (b = 2);
})();
console.log(a);
