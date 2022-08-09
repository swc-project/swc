var r = 2, t = "PASS";
while(r--)(function() {
    return r ? (t = "FAIL") : (r = 1);
    try {} catch (r) {
        var r;
    }
})();
console.log(t);
