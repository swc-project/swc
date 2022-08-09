var n = "PASS";
for(var o in "12")(function(o) {
    (o >>= 1) && (n = "FAIL"), (o = 2);
})();
console.log(n);
