var a = 2, b = "PASS";
while(a--)(function() {
    return a ? (b = "FAIL") : (a = 1);
    try {} catch (a) {
        var a;
    }
})();
console.log(b);
