var c = "FAIL";
!(function () {
    if (NaN === void (c = "PASS"));
})();
console.log(c);
