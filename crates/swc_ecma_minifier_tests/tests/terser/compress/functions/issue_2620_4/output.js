var c = "FAIL";
!(function () {
    switch (NaN) {
        case void (c = "PASS"):
    }
})();
console.log(c);
