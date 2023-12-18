var o = "PASS";
for(var n in "12")(function(o) {
    (o >>= 1) && (o = "FAIL"), (o = 2);
})();
console.log(o);
